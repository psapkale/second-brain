import { useUser } from '@/hooks/useUser';
import axios from 'axios';

export const useSpaceController = () => {
  const { getToken } = useUser();
  const token = getToken();

  const fetchSpaces = async () => {
    return axios.get(`${import.meta.env.VITE_BE_URL}/api/v1/containers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const fetchSpaceById = async (spaceId: string) => {
    return axios.get(`${import.meta.env.VITE_BE_URL}/api/v1/${spaceId}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const renameSpace = async (spaceId: string, title: string) => {
    return axios.post(
      `${import.meta.env.VITE_BE_URL}/api/v1/${spaceId}/rename-container`,
      {
        title,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const createSpace = async (title: string) => {
    return axios.post(
      `${import.meta.env.VITE_BE_URL}/api/v1/create-container`,
      {
        title: title,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const fetchSharedSpace = async (spaceId: string) => {
    return axios.get(`${import.meta.env.VITE_BE_URL}/api/v1/${spaceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const deleteSpace = async (spaceId: string) => {
    return axios.delete(
      `${import.meta.env.VITE_BE_URL}/api/v1/${spaceId}/delete-container`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const changeVisibility = async (spaceId: string, visible: boolean) => {
    return axios.post(
      `${import.meta.env.VITE_BE_URL}/api/v1/${spaceId}/toPublic`,
      {
        toPublic: visible,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  return {
    fetchSpaces,
    fetchSpaceById,
    renameSpace,
    createSpace,
    fetchSharedSpace,
    deleteSpace,
    changeVisibility,
  };
};

export const usePostController = () => {
  const { getToken } = useUser();
  const token = getToken();

  const createPost = async (
    spaceId: string,
    title: string,
    link: string,
    contentType: string
  ) => {
    return axios.post(
      `${import.meta.env.VITE_BE_URL}/api/v1/${spaceId}/create-post`,
      {
        title,
        link,
        contentType,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const deletePost = async (spaceId: string, postId: string) => {
    return axios.delete(
      `${import.meta.env.VITE_BE_URL}/api/v1/${spaceId}/delete-post/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const renamePost = async (spaceId: string, postId: string, title: string) => {
    return axios.post(
      `${import.meta.env.VITE_BE_URL}/api/v1/${spaceId}/rename-post/${postId}`,
      {
        title,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  return { createPost, deletePost, renamePost };
};
