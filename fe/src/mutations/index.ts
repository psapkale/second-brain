import { usePostController, useSpaceController } from '@/controllers';
import { PostData } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useSpaceMutations = (spaceId: string) => {
  const navigate = useNavigate();
  const { createSpace, renameSpace, deleteSpace, changeVisibility } =
    useSpaceController();
  const queryClient = useQueryClient();

  const { mutate: createSpaceMutation } = useMutation({
    mutationKey: ['createSpace'],
    mutationFn: (title: string) => createSpace(title),
    onSuccess: (data) => {
      toast.success('Space created successfully', {
        icon: '✅',
      });
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
      navigate(`/spaces/${data.data.container.id}`);
    },
    onError: (error) => {
      console.log(error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          return toast.error(error.response.data.error.message);
        }
      }
      toast.error('Failed to create space');
    },
  });

  const { mutate: renameSpaceMutation } = useMutation({
    mutationKey: ['renameSpace', spaceId],
    mutationFn: (title: string) => renameSpace(spaceId, title),
    onSuccess: () => {
      toast.success('Space renamed successfully');
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
    },
    onError: (error) => {
      toast.error('Failed to rename space');
      console.log(error);
    },
  });

  const { mutate: deleteSpaceMutation } = useMutation({
    mutationKey: ['deleteSpace', spaceId],
    mutationFn: () => deleteSpace(spaceId),
    onSuccess: (data) => {
      toast.success(`${data.data.container.title} deleted successfully`, {
        icon: '🚮',
      });
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
      navigate('/spaces');
    },
    onError: (error) => {
      console.error(error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          return toast.error(error.response.data.error.message);
        }
      }
      toast.error(`Failed to delete space`);
    },
  });

  const { mutate: changeVisibilityMutation } = useMutation({
    mutationKey: ['changeVisibility', spaceId],
    mutationFn: (visible: boolean) => changeVisibility(spaceId, visible),
    onSuccess: (data) => {
      toast.success(
        `${data.data.updatedContainer.title} is now ${
          data.data.updatedContainer.isPublic ? 'public' : 'private'
        }`
      );
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
    },
    onError: (error) => {
      console.error(error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          return toast.error(error.response.data.error.message);
        }
      }
      toast.error('Failed to change visibilty');
    },
  });
  return {
    createSpaceMutation,
    renameSpaceMutation,
    deleteSpaceMutation,
    changeVisibilityMutation,
  };
};

export const usePostMutations = (spaceId: string) => {
  const { createPost, deletePost, renamePost } = usePostController();
  const queryClient = useQueryClient();

  const { mutate: createPostMutation } = useMutation({
    mutationKey: ['createPost', spaceId],
    mutationFn: (post: Partial<PostData>) =>
      createPost(spaceId, post.title!, post.link!, post.contentType!),
    onSuccess: () => {
      toast.success('Post added successfully', { icon: '🎉' });
      queryClient.invalidateQueries({
        queryKey: ['space', spaceId.toString()],
      });
    },
    onError: (error) => {
      console.error(error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          return toast.error(error.response.data.error.message);
        }
      }
      toast.error('Failed to add post');
    },
  });

  const { mutate: deletePostMutation } = useMutation({
    mutationKey: ['deletePost', spaceId],
    mutationFn: (postId: string) => deletePost(spaceId, postId),
    onSuccess: (data) => {
      toast.success(`${data.data.post.title} deleted successfully`, {
        icon: '🚮',
      });
      queryClient.invalidateQueries({
        queryKey: ['space', spaceId.toString()],
      });
    },
    onError: (error) => {
      console.error(error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          return toast.error(error.response.data.error.message);
        }
      }
      toast.error('Failed to delete post');
    },
  });

  const { mutate: renamePostMutation } = useMutation({
    mutationKey: ['renamePost', spaceId],
    mutationFn: (post: Partial<PostData>) =>
      renamePost(spaceId, post.id!, post.title!),
    onSuccess: () => {
      toast.success('Post renamed successfully');
      queryClient.invalidateQueries({
        queryKey: ['space', spaceId.toString()],
      });
    },
    onError: (error) => {
      console.error(error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          return toast.error(error.response.data.error.message);
        }
      }
      toast.error('Failed to rename post');
    },
  });

  return {
    createPostMutation,
    deletePostMutation,
    renamePostMutation,
  };
};
