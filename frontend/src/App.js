import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PostForm from './components/PostForm';
import ProfilePictureCard from './components/ProfilePictureCard';
import PostItem from './components/PostItem';
import Header from './components/Header';
const mockAuthor = {
  type: 'author',
  id: 'http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471',
  url: 'http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471',
  host: 'http://127.0.0.1:5454/',
  displayName: 'Greg Johnson',
  github: 'http://github.com/gjohnson',
  profileImage: 'https://i.imgur.com/k7XVwpB.jpeg',
};
const mockPost = {
  type: 'post',
  title: 'A post title about a post about web dev',
  id: 'http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e',
  source: 'http://lastplaceigotthisfrom.com/posts/yyyyy',

  origin: 'http://whereitcamefrom.com/posts/zzzzz',
  description: 'This post discusses stuff -- brief',
  contentType: 'text/markdown',
  content: '[link](https://www.example.com/my great page)',

  author: {
    type: 'author',

    id: 'http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e',

    host: 'http://127.0.0.1:5454/',

    displayName: 'Lara Croft',

    url: 'http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e',

    github: 'http://github.com/laracroft',

    profileImage: 'https://i.imgur.com/k7XVwpB.jpeg',
  },

  categories: ['web', 'tutorial'],

  count: 1023,

  comments:
    'http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments',

  commentsSrc: {
    type: 'comments',
    page: 1,
    size: 5,
    total: 41,
    post: 'http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e',
    id: 'http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments',
    comments: [
      {
        type: 'comment',
        author: {
          type: 'author',

          id: 'http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471',

          url: 'http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471',
          host: 'http://127.0.0.1:5454/',
          displayName: 'Greg Johnson',

          github: 'http://github.com/gjohnson',

          profileImage: 'https://i.imgur.com/k7XVwpB.jpeg',
        },
        comment: 'Sick Olde English',
        contentType: 'text/markdown',

        published: '2015-03-09T13:07:04+00:00',

        id: 'http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments/f6255bb01c648fe967714d52a89e8e9c',
      },
    ],
  },

  published: '2015-03-09T13:07:04+00:00',

  visibility: 'PUBLIC',

  unlisted: false,
};
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/posts/:post_id" element={<PostItem props={mockPost} />} />
        <Route
          path="/profile"
          element={<ProfilePictureCard props={mockAuthor} />}
        />
        <Route path="/post/new" element={<PostForm />} />
      </Routes>
    </>
  );
}

export default App;
