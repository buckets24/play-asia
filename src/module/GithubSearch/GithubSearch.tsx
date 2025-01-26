import React, { useEffect, useState } from 'react';
import { fetchGitHubProfile } from '../../utils/github';
import { useDebounce } from '../../utils/debounce';

const DEFAULT_USERNAME = 'buckets24';

interface GitHubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

const GithubSearch: React.FC = () => {
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedUsername = useDebounce(username, 500); // 500ms delay

  const handleSearch = async () => {
    try {
      const data = await fetchGitHubProfile(username);
      setProfile(data);
      setError(null);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setProfile(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    handleSearch();
  }, [debouncedUsername]);

  return (
    <div data-astro-module="GithubSearch" className="grid grid-cols-12 gap-4 md:max-w-xl md:mx-auto lg:max-w-6xl">
      <div data-id="search-container" className="col-span-12 lg:col-span-3">
        <h2 className="text-xl font-bold mb-2">GitHub Profile Search</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-6 rounded-xl w-full"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <div data-id="profile-container" className="col-span-12 lg:col-span-9">
        {profile && (
          <div className="flex items-center justify-center gap-6 p-4 rounded-xl shadow-lg">
            {isLoading ? (
              <div className="w-24 h-24 rounded-full mx-auto bg-gray-200 animate-pulse" />
            ) : (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-24 h-24 rounded-full mx-auto"
              />
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold mt-4">
                {isLoading ? (
                  <div className="w-28 h-6 rounded-xl bg-gray-200 animate-pulse" />
                ) : (
                  <a href={profile.html_url} target="_blank" rel="noopener noreferrer">
                    {profile.name || profile.login}
                  </a>
                )}
              </h2>
              <p>{profile.bio}</p>
              <div className="mt-4 flex flex-row flex-wrap gap-4">
                <ProfileDetails isLoading={isLoading} label="Public Repos" value={profile.public_repos} />
                <ProfileDetails isLoading={isLoading} label="Followers" value={profile.followers} />
                <ProfileDetails isLoading={isLoading} label="Following" value={profile.following} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GithubSearch;

const ProfileDetails = ({ isLoading, label, value }: { isLoading: boolean; label: string; value: string | number }) => {
  return (
    <div>
      {isLoading ? (
        <>
          <div className="w-28 h-5 rounded-xl bg-gray-200 animate-pulse mb-1" />
          <div className="w-28 h-5 rounded-xl bg-gray-200 animate-pulse" />
        </>
      ) : (
        <>
          <p className="font-semibold text-sm">{label}</p>
          <p className="font-light">{value}</p>
        </>
      )}
    </div>
  )
};
