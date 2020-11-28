const loader = (message: string): string => `
  <div class="loading">
    <div class="loadingItem">
      <div class="spinner"></div>
      <div class="blinking">
        <span>${message}</span>
      </div>
    </div>
  </div>
`;

export default loader;
