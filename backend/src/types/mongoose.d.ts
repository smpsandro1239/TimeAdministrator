// Extensões para tipos do Mongoose
declare module 'mongoose' {
  interface Document {
    id: string;
    toObject(): any;
  }
}