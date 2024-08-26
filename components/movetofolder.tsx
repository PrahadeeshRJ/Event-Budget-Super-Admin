import * as React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Check, FolderInput } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { createBrowserClient } from "@supabase/ssr";
import { Label } from "./ui/label";
import { useToast } from "@/components/ui/use-toast";

// Initialize Supabase client
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define the form validation schema
const FormSchema = z.object({
  folderId: z.string().min(1, { message: "Folder is required" }),
});

type FormData = z.infer<typeof FormSchema>;

interface Folder {
  uuid: string;
  title: string;
}

interface Event {
  id: string;
  title: string;
}

interface MoveToFolderProps {
  filteredEvents: Event[];
  sharedEvents: Event[];
  userEmail: string;
  fetchEvents: (userEmail: string) => void;
  initialSelectedEvents: string[]; // This is for both filtered and shared events
  selectedSharedEvents: string[]; // New prop for selected shared events
}

export function MoveToFolder({
  filteredEvents = [],
  sharedEvents = [],
  userEmail,
  fetchEvents,
  initialSelectedEvents,
  selectedSharedEvents, // Accept the selected shared events
}: MoveToFolderProps) {
  const [open, setOpen] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]); // Initially empty
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      folderId: "",
    },
  });

  // Fetch folders when dialog opens
  useEffect(() => {
    const fetchFolders = async () => {
      const { data, error } = await supabase
        .from("event_folders")
        .select("uuid, title")
        .eq("created_by", userEmail);

      if (error) {
        console.error("Error fetching folders:", error);
        toast({
          title: "Error",
          description: "Failed to fetch folders.",
          variant: "destructive",
        });
      } else {
        setFolders(data || []);
      }
    };

    if (open) {
      fetchFolders();
      setSelectedEvents([...initialSelectedEvents, ...selectedSharedEvents]); // Combine initial and selected shared events
      setSelectedFolder(null);
    }
  }, [open, userEmail, toast, initialSelectedEvents, selectedSharedEvents]);

  // Handle event selection
  const handleSelect = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  // Handle folder selection
  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId);
    setValue("folderId", folderId);
    clearErrors("folderId");
  };

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    if (selectedEvents.length === 0) {
      setError("folderId", {
        type: "manual",
        message: "At least one event must be selected",
      });
      return;
    }

    const selectedFolderId = data.folderId;

    const { data: folderData, error: folderError } = await supabase
      .from("event_folders")
      .select("events")
      .eq("uuid", selectedFolderId)
      .single();

    if (folderError) {
      console.error("Error fetching folder events:", folderError);
      toast({
        title: "Error",
        description: "Failed to fetch folder events.",
        variant: "destructive",
      });
      return;
    }

    const currentEvents = folderData?.events || [];
    const newEvents = selectedEvents
      .map((eventId) => {
        const event = [...filteredEvents, ...sharedEvents].find(
          (e) => e.id === eventId
        );
        return event ? { id: event.id, title: event.title } : null;
      })
      .filter(Boolean);

    const updatedEvents = [...currentEvents, ...newEvents].sort((a, b) =>
      a.id < b.id ? -1 : a.id > b.id ? 1 : 0
    );

    const { error: updateError } = await supabase
      .from("event_folders")
      .update({ events: updatedEvents })
      .eq("uuid", selectedFolderId);

    if (updateError) {
      console.error("Error updating folder:", updateError);
      toast({
        title: "Error",
        description: "Failed to update the folder.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Events have been moved to the selected folder.",
      });
      fetchEvents(userEmail);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
      <div
          className="py-2.5 px-3 border rounded border-[#D4D4D8] cursor-pointer transition-all duration-300 text-sm text-primary-primary_color hover:bg-blue-50 hover:border-white hover:text-primary-accent"
          aria-label="Add New Folder"
          onClick={() => setOpen(true)}
        >
          <FolderInput size={20} />
        </div>
        {/* <Button
          variant="outline"
          className="text-primary-accent border-primary-accent"
          aria-label="Move to Folder"
        >
          
        </Button> */}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white rounded-[6px] h-[580px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primary-text_primary text-[18px] font-bold">
            Move Events to Folder
          </AlertDialogTitle>
          <p className="text-sm">Move the selected event(s) to a folder</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="py-[6px]">
              <Label className="text-sm text-primary-text_primary font-semibold pb-[6px]">
                Selected Folder:
              </Label>
              <Popover>
                <PopoverTrigger>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between border-none text-grey-100 rounded-[6px] -ml-5 mb-2"
                  >
                    {selectedFolder
                      ? folders.find((folder) => folder.uuid === selectedFolder)
                          ?.title
                      : "Choose a folder below"}
                  </Button>
                </PopoverTrigger>
                <div className="w-full h-[150px] overflow-x-auto p-0 border border-gray-300 rounded-[6px]">
                  <Command>
                    <CommandInput placeholder="Search folder..." className="focus-visible:border-none" />
                    <CommandList>
                      <CommandEmpty>No folders found.</CommandEmpty>
                      <CommandGroup>
                        {folders.map((folder) => (
                          <CommandItem
                            key={folder.uuid}
                            value={folder.uuid}
                            onSelect={() => handleFolderSelect(folder.uuid)}
                            className="cursor-pointer flex items-center"
                          >
                            <div
                              className={`border rounded-[4px] mr-2 border-gray-400 p-[2px] ${
                                selectedFolder === folder.uuid
                                  ? "bg-primary-accent"
                                  : "bg-opacity-0"
                              }`}
                            >
                              <Check
                                className={`h-[10px] w-[10px] text-bold text-white ${
                                  selectedFolder === folder.uuid
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                            </div>
                            {folder.title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              </Popover>
            </div>
            <div className="py-[3px]">
              <Label className="text-sm text-primary-text_primary font-semibold pb-[0px]">
                Events:
              </Label>
              <Popover>
                <PopoverTrigger>
                  <Button
                    role="combobox"
                    className="w-full justify-between border-[#D4D4D8] text-grey-100 rounded-[6px] -ml-5 mb-2"
                  >
                    {selectedEvents.length > 0
                      ? `${selectedEvents.length} event(s) selected`
                      : "Select the events below"}
                  </Button>
                </PopoverTrigger>
                <div className="w-full h-[150px] overflow-x-auto p-0 border border-gray-300 rounded-[6px]">
                  <Command>
                    <CommandInput placeholder="Search events..." />
                    <CommandList>
                      <CommandEmpty>No events found.</CommandEmpty>
                      <CommandGroup>
                        {[...filteredEvents, ...sharedEvents].map((event) => (
                          <CommandItem
                            key={event.id}
                            value={event.id}
                            onSelect={() => handleSelect(event.id)}
                            className="cursor-pointer flex items-center"
                          >
                            <div
                              className={`border rounded-[4px] mr-2 border-gray-400 p-[2px] ${
                                selectedEvents.includes(event.id)
                                  ? "bg-primary-accent"
                                  : "bg-opacity-0"
                              }`}
                            >
                              <Check
                                className={`h-[10px] w-[10px] text-bold text-white ${
                                  selectedEvents.includes(event.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                            </div>
                            {event.title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              </Popover>
            </div>
            <AlertDialogFooter>
            <AlertDialogFooter className="w-full flex flex-row items-center sm:justify-center mt-4">
                <AlertDialogCancel className="sm:w-1/2 border-gray-300 rounded" onClick={() => setOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <Button
                  type="submit"
                  className="w-1/2 bg-primary-accent rounded text-white hover:bg-[#32A0FF]"
                >
                  Move
                </Button>
              </AlertDialogFooter>
             
            </AlertDialogFooter>
          </form>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
