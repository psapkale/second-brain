import { useUser } from '@/hooks/useUser';
import { SpaceData, UserData } from '@/types';
import {
  Check,
  Ellipsis,
  Globe,
  GlobeLock,
  Link2,
  LogOut,
  Moon,
  Pencil,
  PlusCircle,
  Space,
  Sun,
  Trash,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Skeleton } from 'primereact/skeleton';
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useTheme } from '@/context/themeContext';
import { useSidebar } from '@/context/sidebarContext';
import { motion } from 'framer-motion';
import { useSpaceQueries } from '@/queries';
import { useSpaceMutations } from '@/mutations';

const Sidebar = () => {
  const { showSidebar } = useSidebar();
  const { getUser, getToken, removeUser } = useUser();
  const user: UserData = getUser();
  const token: string = getToken();
  const navigate = useNavigate();
  const { spaceId } = useParams();
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const titleRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isRenaming, setIsRenaming] = useState(false);

  //* queries
  const { fetchSpacesQuery } = useSpaceQueries();
  const { data: spaces, isLoading, error } = fetchSpacesQuery;

  //* mutations
  const {
    createSpaceMutation,
    renameSpaceMutation,
    deleteSpaceMutation,
    changeVisibilityMutation,
  } = useSpaceMutations(spaceId!);

  const handleSignOut = async () => {
    try {
      await removeUser();
      navigate('/auth');

      toast.success('See you soon', {
        icon: '😿',
      });
    } catch (err) {
      console.log(err);

      toast.error('Failed to sign out');
    }
  };

  const handleRenameSpace = async () => {
    if (inputRef.current && inputRef.current.value.length <= 2) {
      return toast.error('Title is too short');
    }

    renameSpaceMutation(inputRef.current?.value as string);
    setIsRenaming(false);
  };

  const handleCreateSpace = async () => {
    if (titleRef.current?.value.length && titleRef.current?.value.length < 2) {
      return toast.error('Title must contain atleast 2 letters');
    }

    createSpaceMutation(titleRef.current?.value as string);
    setIsOpen(false);
  };

  const handleDeleteSpace = async () => {
    deleteSpaceMutation();
  };

  const handleChangeVisibility = async (visible: boolean) => {
    changeVisibilityMutation(visible);
  };

  const handleCopyShareLink = async (id: string) => {
    try {
      const link = `${import.meta.env.VITE_FE_URL}/s/${id}`;
      await navigator.clipboard.writeText(link);

      toast.success(`Link copied ${link}`, {
        icon: '🎉',
      });
    } catch (err) {
      console.log(err);
      toast.error('Failed to copy');
    }
  };

  if (!user && !token) {
    toast.error('Please login to access Spaces');

    navigate('/auth');
    return;
  }

  if (error) {
    toast.error('Failed to fetch spaces');
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`${
        showSidebar ? 'translate-x-0' : '-translate-x-full hidden'
      } ${
        isDarkMode
          ? 'bg-black text-white border-[#171717]'
          : 'bg-white border-slate-200'
      } border-r-2 w-full md:w-[30%] lg:w-[20%] h-full top-0 left-0 py-4 px-3 flex gap-5 flex-col`}
    >
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="text-4xl font-semibold flex gap-2 items-end"
      >
        <Space />
        <span>Pro.</span>
        <span>Space</span>
      </motion.div>

      {/* User info */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2"
      >
        <img
          src={user.imgUrl}
          alt={user.name}
          className="w-8 rounded-full object-cover"
        />
        <span>{user.name}'s Spaces</span>
      </motion.div>

      {/* Theme */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3"
      >
        <Button
          variant={isDarkMode ? 'default' : 'outline'}
          onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>
        <Button
          variant={isDarkMode ? 'default' : 'outline'}
          className="flex items-center"
          onClick={handleSignOut}
        >
          <span>Sign out</span>
          <LogOut />
        </Button>
      </motion.div>

      {/* Spaces container */}
      {isLoading ? (
        <div className="flex gap-2 flex-col">
          {Array(10)
            .fill('')
            .map((_, idx) => (
              <Skeleton
                key={Math.random() * idx + 1}
                height="30px"
                className={`${isDarkMode ? 'bg-[#0e1114]' : ''} px-2`}
              />
            ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-full max-h-[60vh] flex gap-2 flex-col overflow-y-scroll no-scrollbar"
        >
          {spaces?.data?.containers
            .sort(
              (a: SpaceData, b: SpaceData) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            .map((space: SpaceData) => (
              <Link
                key={space.id}
                to={`/spaces/${space.id}`}
                className={`py-1 px-2 flex items-center justify-between rounded-sm ${
                  isDarkMode
                    ? 'hover:bg-[#171717] text-white'
                    : 'hover:bg-slate-100'
                }`}
                style={{
                  backgroundColor:
                    spaceId === space.id
                      ? isDarkMode
                        ? '#171717'
                        : '#f1f5f9'
                      : '',
                }}
              >
                {isRenaming && space.id === spaceId ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      ref={inputRef}
                      defaultValue={space.title}
                      placeholder={space.title}
                      className={`border ${
                        isDarkMode ? 'border-gray-800' : 'border-gray-200'
                      }`}
                    />
                  </div>
                ) : (
                  <span className="capitalize w-[80%] overflow-x-scroll no-scrollbar">
                    {space.title}
                  </span>
                )}
                {isRenaming && space.id === spaceId ? (
                  <Check
                    className="w-5 h-5 cursor-pointer"
                    onClick={handleRenameSpace}
                  />
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Ellipsis
                        className="w-4 h-4"
                        style={{
                          display: spaceId === space.id ? 'block' : 'none',
                        }}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className={`${
                        isDarkMode ? 'bg-black text-white border-slate-800' : ''
                      }`}
                    >
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleChangeVisibility(!space.isPublic)}
                      >
                        {space.isPublic ? (
                          <GlobeLock className="w-3 h-3" />
                        ) : (
                          <Globe className="w-3 h-3" />
                        )}
                        <span>{space.isPublic ? 'Private' : 'Public'}</span>
                      </DropdownMenuItem>
                      {space.isPublic && (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleCopyShareLink(space.id)}
                        >
                          <Link2 className="w-3 h-3" />
                          <span>Share</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                          setIsRenaming(true);
                        }}
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Rename</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={handleDeleteSpace}
                      >
                        <Trash className="w-3 h-3 text-red-500" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </Link>
            ))}
        </motion.div>
      )}

      <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
        <DialogTrigger asChild className="sticky bottom-12">
          <Button
            variant={isDarkMode ? 'default' : 'outline'}
            onClick={() => setIsOpen(true)}
          >
            <PlusCircle />
            <span>Create Space</span>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          style={{
            color: isDarkMode ? 'white' : '',
            backgroundColor: isDarkMode ? 'black' : '',
            border: isDarkMode ? '1px solid #272727' : '',
          }}
        >
          <DialogHeader>
            <DialogTitle>Create Space</DialogTitle>
            <DialogDescription>
              Create a independent space to organize the internet.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input
              type="text"
              placeholder="Title"
              ref={titleRef}
              style={{
                border: isDarkMode ? '1px solid #272727' : '',
              }}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleCreateSpace} disabled={isLoading}>
              <PlusCircle />
              <span>Create Space</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Sidebar;
