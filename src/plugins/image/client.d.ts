import { ISize } from 'image-size/dist/types/interface'

declare module '*.jpg' {
  export const dimension: ISize
}
declare module '*.jpeg' {
  export const dimension: ISize
}
declare module '*.png' {
  export const dimension: ISize
}
declare module '*.gif' {
  export const dimension: ISize
}
declare module '*.svg' {
  export const dimension: ISize
}
declare module '*.ico' {
  export const dimension: ISize
}
declare module '*.webp' {
  export const dimension: ISize
}
declare module '*.avif' {
  export const dimension: ISize
}
