'use strict';

// Map of bangs to target URLs
const bangMap = {
  '!w': 'https://en.wikipedia.org/wiki/',
  '!imdb': 'https://www.imdb.com/find?q=',
  '!a': 'https://www.amazon.com/s?k=',
  '!e': 'https://www.ebay.com/sch/i.html?_nkw=',
  '!so': 'https://stackoverflow.com/search?q=',
  '!gh': 'https://github.com/search?q=',
  '!z': 'https://www.zillow.com/homes/',
  '!x': 'https://x.com/search?q=',
  '!li': 'https://www.linkedin.com/search/results/all/?keywords=',
  '!r': 'https://www.reddit.com/search/?q=',
  '!ste': 'https://store.steampowered.com/search/?term=',
  '!nf': 'https://www.netflix.com/search?q=',
  '!p': 'https://www.pinterest.com/search/pins/?q=',
  '!wa': 'https://www.wolframalpha.com/input/?i=',
  '!yt': 'https://www.youtube.com/results?search_query=',
  '!g': 'https://www.google.com/search?q=',
  '!b': 'https://www.bing.com/search?q=',
  '!y': 'https://search.yahoo.com/search?p=',
  '!d': 'https://duckduckgo.com/?q=',
  '!q': 'https://www.quora.com/search?q=',
  '!fb': 'https://www.facebook.com/search/top?q=',
  '!t': 'https://www.tiktok.com/search?q=',
};

async function searchBangs(query, API_KEY) {
  // Convert query to lowercase for consistent matching
  query = query.toLowerCase().trim();

  let bang, searchTerm;

  // Check if the query starts with a bang (e.g., "!w juniper")
  if (query.startsWith('!')) {
    const firstSpace = query.indexOf(' ');
    bang = firstSpace === -1 ? query : query.substring(0, firstSpace);
    searchTerm = firstSpace === -1 ? '' : query.substring(firstSpace + 1);
  }
  // Check if the query ends with a bang (e.g., "juniper !w")
  else if (query.endsWith('!') || query.includes(' !')) {
    const lastSpace = query.lastIndexOf(' ');
    bang = lastSpace === -1 ? query : query.substring(lastSpace + 1);
    searchTerm = lastSpace === -1 ? '' : query.substring(0, lastSpace);
  }
  // If no bang pattern matches, show the popup with all bangs
  else {
    return createBangPopup(query);
  }

  // If the bang is valid and there's a search term, redirect
  if (bangMap[bang] && searchTerm) {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const redirectUrl = bangMap[bang] + encodedSearchTerm;
    return [{ url: redirectUrl, redirect: true }];
  }

  // If the bang is incomplete or invalid, show the popup
  return createBangPopup(query);
}

async function trigger(query) {
  if (query) {
    // console.log(`Trigger called with: "${query}"`);
    query = query.toLowerCase();
    if (query.includes('!')) {
    //   console.log(`That's a bang! Query: ${query}`);
      return true;
    }
  }
  return false;
}

module.exports = { searchBangs, trigger, bangMap };