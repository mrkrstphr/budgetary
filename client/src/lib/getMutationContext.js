export function getMutationContext() {
  const appContext = localStorage.getItem('appContext');

  if (appContext) {
    const context = JSON.parse(appContext);

    if (context.token.token) {
      return { headers: { Authorization: `Bearer ${context.token.token}` } };
    }
  }
}
