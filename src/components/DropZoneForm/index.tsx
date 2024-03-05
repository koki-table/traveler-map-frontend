'use client'

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import Dropzone from '../ui/dropZone'
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { FileCheck2Icon } from 'lucide-react'
import { Button } from '../ui/button'
import { useState } from 'react'

type FileType = { file: null | File }

const defaultValues: FileType = {
  file: null,
}

const DropZoneForm = ({ onSubmit }: { onSubmit: (data: string | ArrayBuffer | null) => void }) => {
  const methods = useForm<FileType>({
    defaultValues,
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
  })
  function handleOnDrop(acceptedFiles: FileList | null) {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const allowedTypes = [
        {
          name: 'image',
          types: ['image/jpeg', 'image/png', 'image/jpg'],
        },
      ]
      const fileType = allowedTypes.find((allowedType) =>
        allowedType.types.find((type) => type === acceptedFiles[0].type),
      )
      if (!fileType) {
        methods.setValue('file', null)
        methods.setError('file', {
          message: 'File type is not valid',
          type: 'typeError',
        })
      } else {
        methods.setValue('file', acceptedFiles[0])
        methods.clearErrors('file')
      }
    } else {
      methods.setValue('file', null)
      methods.setError('file', {
        message: 'File is required',
        type: 'typeError',
      })
    }
  }

  const [imageUrl, setImageUrl] = useState<string | ArrayBuffer | null>(null)

  console.log(imageUrl)

  const fileToBase64: SubmitHandler<FileType> = (e) => {
    if (e === null) return
    const reader = new FileReader()
    reader.readAsDataURL(e.file!)
    reader.onload = () => {
      // base64に変換した結果をstateにセットする
      setImageUrl(reader.result)
      onSubmit(reader.result)
    }
  }

  return (
    <>
      <FormProvider {...methods}>
        <form
          className='flex flex-col items-center justify-center w-100 gap-2'
          onSubmit={methods.handleSubmit(fileToBase64)}
          noValidate
          autoComplete='off'
        >
          <FormField
            control={methods.control}
            name='file'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Dropzone
                    {...field}
                    dropMessage='Drop files or click here'
                    handleOnDrop={handleOnDrop}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {methods.watch('file') && (
            <div className='flex items-center justify-center gap-3 p-4 relative'>
              <FileCheck2Icon className='h-4 w-4' />
              <p className='text-sm font-medium'>{methods.watch('file')?.name}</p>
            </div>
          )}
          <Button type='submit'>Salve</Button>
        </form>
      </FormProvider>
      {imageUrl != null && <img src={String(imageUrl)} alt='Preview' />}
    </>
  )
}

export default DropZoneForm
