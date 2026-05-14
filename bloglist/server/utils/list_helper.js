const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  let favorite = blogs[0];

  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > favorite.likes) {
      favorite = blogs[i];
    }
  }

  return favorite;
};

const mostBlogs = (blogs) => {
  const authors = [];

  for (let i = 0; i < blogs.length; i++) {
    const authorIndex = authors.findIndex((a) => a.author === blogs[i].author);

    if (authorIndex > 0) {
      authors[authorIndex] = {
        ...authors[authorIndex],
        blogs: authors[authorIndex].blogs + 1,
      };
    } else {
      authors.push({
        author: blogs[i].author,
        blogs: 1,
      });
    }
  }

  if (authors.length === 0) {
    return null;
  }

  let author = authors[0];

  for (let i = 0; i < authors.length; i++) {
    if (authors[i].blogs > author.blogs) {
      author = authors[i];
    }
  }

  return author;
};

const mostLikes = (blogs) => {
  const authors = [];

  for (let i = 0; i < blogs.length; i++) {
    const authorIndex = authors.findIndex((a) => a.author === blogs[i].author);

    if (authorIndex > 0) {
      authors[authorIndex] = {
        ...authors[authorIndex],
        likes: authors[authorIndex].likes + blogs[i].likes,
      };
    } else {
      authors.push({
        author: blogs[i].author,
        likes: blogs[i].likes,
      });
    }
  }

  if (authors.length === 0) {
    return null;
  }

  let author = authors[0];

  for (let i = 0; i < authors.length; i++) {
    if (authors[i].likes > author.likes) {
      author = authors[i];
    }
  }

  return author;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
