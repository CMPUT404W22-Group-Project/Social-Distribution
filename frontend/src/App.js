import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PostNew from './containers/Post/PostNew';
import PublicPost from './containers/Post/PublicPost';
import AuthorPost from './containers/Post/AuthorPost';
import ProfilePictureCard from './components/ProfilePictureCard';
import PostItem from './components/PostItem';
import Header from './components/Header';
import Profile from './containers/Profile/Profile';
import ProfileEdit from './containers/Profile/ProfileEdit';
import Login from './containers/Login/Login';
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
    author: {
        displayName: 'Greg Johnson',
        github: 'http://github.com/gjohnson',
        id: '1d698d25ff008f7538453c120f581471',
        profileImage: 'https://i.imgur.com/k7XVwpB.jpeg',
    },
    authorId: '1d698d25ff008f7538453c120f581471',
    categories: ['Web3'],
    content: 'hfdsfdafdsa',
    contentType: 'text/plain',
    count: 0,
    description: 'sdadsa',
    host: 'http://localhost:8000/',
    id: 'http://localhost:8000/authors/1d698d25ff008f7538453c120f581471/posts/cl0brt8oj00024o7k1yxkf3v4',
    likeCount: 0,
    origin: 'dsad',
    published: '2022-03-04T02:01:27.859Z',
    source: 'dsdas',
    title: 'dfad',
    type: 'post',
    unlisted: false,
    url: 'http://localhost:8000/authors/1d698d25ff008f7538453c120f581471/posts/cl0brt8oj00024o7k1yxkf3v4',
    visibility: 'PUBLIC',
};
function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/posts" element={<PublicPost />} />
                <Route path="/authors/:authorId" element={<Profile />} />
                <Route
                    path="/authors/:authorId/edit"
                    element={<ProfileEdit />}
                />
                <Route
                    path="/authors/:authorId/posts"
                    element={<AuthorPost />}
                />
                <Route
                    path="/posts/:post_id"
                    element={<PostItem props={mockPost} />}
                />
                <Route
                    path="/profile"
                    element={<ProfilePictureCard props={mockAuthor} />}
                />
                <Route
                    path="/authors/:authorId/post/new"
                    element={<PostNew />}
                />
            </Routes>
        </>
    );
}
// const mapStateToProps = (state) => ({
//   isSignedIn: state.auth.isSignedIn,
//   author: state.auth.author,
// });

// export default connect(mapStateToProps)(App);
export default App;
