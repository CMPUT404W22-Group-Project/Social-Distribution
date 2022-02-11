import React from 'react';
import ProfilePictureCard from './components/ProfilePictureCard';
const mockAuthor = {
  type: 'author',
  id: 'http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471',
  url: 'http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471',
  host: 'http://127.0.0.1:5454/',
  displayName: 'Greg Johnson',
  github: 'http://github.com/gjohnson',
  profileImage: 'https://i.imgur.com/k7XVwpB.jpeg',
};
function App() {
  return <ProfilePictureCard props={mockAuthor} />;
}

export default App;
