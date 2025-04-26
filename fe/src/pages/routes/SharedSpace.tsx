import PostCard from '@/components/PostCard';
import { useTheme } from '@/context/themeContext';
import { PostData } from '@/types';
import { Skeleton } from 'primereact/skeleton';
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Moon, Space, Sun } from 'lucide-react';
import { useSpaceQueries } from '@/queries';

const SharedSpace = () => {
  const { spaceId } = useParams();
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  //* queries
  const { fetchSharedSpaceQuery } = useSpaceQueries();
  const { data: space, isLoading } = fetchSharedSpaceQuery(spaceId!);

  if (isLoading) {
    return (
      <div
        className={`w-full ${
          isDarkMode ? 'bg-black text-white' : ''
        } p-3 md:p-10 flex items-start gap-5 flex-col`}
      >
        <Skeleton
          width="200px"
          height="20px"
          className={`${isDarkMode ? 'bg-[#0e1114]' : ''}`}
        />

        <Skeleton
          width="500px"
          height="50px"
          className={`${isDarkMode ? 'bg-[#0e1114]' : ''}`}
        />

        <div className="my-5 flex flex-wrap items-center justify-start gap-4">
          <Skeleton
            width="400px"
            height="300px"
            className={`${isDarkMode ? 'bg-[#0e1114]' : ''}`}
          />
          <Skeleton
            width="600px"
            height="300px"
            className={`${isDarkMode ? 'bg-[#0e1114]' : ''}`}
          />
          <Skeleton
            width="600px"
            height="300px"
            className={`${isDarkMode ? 'bg-[#0e1114]' : ''}`}
          />
          <Skeleton
            width="400px"
            height="300px"
            className={`${isDarkMode ? 'bg-[#0e1114]' : ''}`}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full min-h-screen ${
        isDarkMode ? 'bg-black text-white' : ''
      } p-3 md:p-10 flex items-start gap-2 flex-col`}
    >
      <Link
        to={'/spaces'}
        className="text-5xl font-semibold flex gap-2 items-end mb-10"
      >
        <Space />
        <span>Project </span>
        <span>Space</span>
      </Link>

      {!space ? (
        <div className="w-full h-[70vh]  border-[#171717] flex items-center justify-center flex-col gap-5 rounded-xl">
          <img
            src="/wakeup-duck.png"
            alt="no-public"
            className="w-[50vw] md:w-[20vw] h-[42vh]"
          />
          <div>
            <h1 className="text-xl font-semibold">Space is not public</h1>
            <span className="text-sm">
              (ask the owner to make the 'space public)
            </span>
          </div>
        </div>
      ) : (
        <>
          {/* User Info */}
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={space?.data.container.creator.imgUrl}
                alt={space?.data.container.creator.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-lg fontsem">
                {space?.data.container.creator.name}
              </span>
            </div>

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
          </div>

          {/* Space Info */}
          <div className="pl-2 my-3">
            <span className="text-4xl font-semibold">
              {space?.data.container.title}
            </span>
          </div>

          {/* Post */}
          <div className="w-full flex items-center justify-start flex-wrap gap-5">
            {space?.data.container.posts.map((post: PostData) => (
              <PostCard key={post.id} post={post} shareMode={true} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SharedSpace;
