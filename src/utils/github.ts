export async function fetchGitHubProfile(username: string): Promise<any> {
  const apiUrl = `https://api.github.com/users/${username}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`User "${username}" not found.`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    throw error;
  }
}
