export {};

declare global {
  interface Window {
    bracketsViewer: {
      render: (data: any, config?: any) => void;
    };
  }
}
