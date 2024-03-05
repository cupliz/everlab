import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-toastify'

export const BASE_URL = 'http://localhost:3001'

export const useUpload: any = () => {
  const queryClient: any = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      const response = await axios.post(`${BASE_URL}/upload`, payload)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['files'])
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message)
    },
  })
}

export const useGetFiles: any = () => {
  return useQuery({
    queryKey: ['files'],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/files`)
      return response.data
    },
  })
}

export const useGetParsing: any = () => {
  return useQuery({
    queryKey: ['parsing'],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/parsing`)
      return response.data
    },
  })
}
