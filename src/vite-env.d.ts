/// <reference types="vite/client" />

// SVG module declarations for local icon imports
declare module '*.svg' {
    const content: string;
    export default content;
}
