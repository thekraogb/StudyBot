import '@testing-library/jest-dom';


Object.defineProperty(global, "localStorage", {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
});

global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({}),
    })
  );

  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  
  global.ResizeObserver = ResizeObserver;


  
  
