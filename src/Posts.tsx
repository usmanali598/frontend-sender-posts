import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import './App.css';

// query string
function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Posts: React.FC = () => {
    let location = useLocation();
    let query = useQuery();
    let pageNumber = query.get('page') || 1;
    let token = query.get('token') || '';

    const [sender, setSender] = useState<any>();
    const [senderSearch, setSenderSearch] = useState<any>();
    const [count, setCount] = useState<any>();
    const [posts, setPosts] = useState<any>();
    const [filterPosts, setFilterPosts] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<boolean>(false);
    const { id } = useParams();
    const counts: any = {};

    useEffect(() => {
        setIsLoading(true);
        fetch(`https://api.supermetrics.com/assignment/posts?sl_token=${token}&page=${pageNumber}`)
            .then(res => res.json())
            .then(response => {
                setIsLoading(false);
                setFilterPosts(response.data.posts);
                response.data.posts.forEach(function (x: any) { counts[x.from_name] = (counts[x.from_name] || 0) + 1; });
                setSenderSearch(counts);
                setCount(counts);
            }).catch(err => {
                setIsLoading(false);
                setErrorMessage(true);
                console.log(err.message);
            })
    }, []);

    useEffect(() => {
        // fetch posts directly by adding route as user id(e.g /user_1) - search posts is not working in this case
        if ((id && id.indexOf('user_') > -1) && filterPosts) {
            let filterQPPosts = filterPosts && filterPosts.filter((list: any) => list.from_id == id);
            filterPosts && setPosts(filterQPPosts);
        }
    }, [filterPosts])

    const searchSenders = async (e: any) => {
        if (e.key.toLowerCase() == 'enter') {
            let filtered = count && Object.keys(count).
                filter((key) => key.toLowerCase().includes(e.target.value.toLowerCase())).
                reduce((cur, key) => { return Object.assign(cur, { [key]: count[key] }) }, {});
            await setSenderSearch(filtered);
        }
    }

    const searchPosts = async (e: any) => {
        if (e.key.toLowerCase() == 'enter') {
            if (sender) {
                console.log(sender, 'sender works');
                let items: any = sender && sender.filter((item: any) => item.message.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1)
                await setPosts(items);
            } else if (posts) {
                console.log(posts, 'posts');
                let postsFiltered = posts.filter((postItems: any) => postItems.from_id === id);
                let postsFilteredUrlId: any = postsFiltered.filter((serch: any) => serch.message.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1)
                await setPosts(postsFilteredUrlId);
            }
        }
    }

    const defaultPostsSorting = (postsArray: any) => {
        //order by creation time
        postsArray.sort((x: any, y: any) => +new Date(x.created_time) - +new Date(y.created_time));
    }

    let postsList = (e: any) => {
        let senderName: any = e.target.parentElement.childNodes[0].textContent;
        let postsFiltered = filterPosts && filterPosts.filter((postItems: any) => postItems.from_name === senderName);
        setPosts(postsFiltered);
        setSender(postsFiltered);
        defaultPostsSorting(postsFiltered);
    }

    function addZero(i: any) {
        if (i < 10) { i = "0" + i }
        return i;
    }

    const dateFix = (dateTimes: any) => {
        var moment = dateTimes.substr(0, dateTimes.indexOf('+'));
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var d = new Date(moment);
        var monthName = months[d.getMonth()];
        var day = addZero(d.getDate());
        let h = addZero(d.getHours());
        let m = addZero(d.getMinutes());
        let s = addZero(d.getSeconds());
        let y = d.getFullYear();
        return `${monthName} ${day}, ${y} ${h}:${m}:${s}`;
    };

    const sortPostsAsc = () => {
        if (posts) {
            let postsCopy = [...posts];
            postsCopy.sort((x: any, y: any) => +new Date(x.created_time) - +new Date(y.created_time));
            setPosts(postsCopy);
        }
    }

    const sortPostsDesc = () => {
        if (posts) {
            let postsCopyDesc = [...posts];
            postsCopyDesc.sort((x: any, y: any) => +new Date(y.created_time) - +new Date(x.created_time))
            setPosts(postsCopyDesc);
        }
    }

    return (
        <div className="App">
            <div className='cont'>
                <div className="searches">
                    <div className="search1">
                        <input type="text" name='searchSenders' onKeyDown={(e) => searchSenders(e)} placeholder='search' />
                    </div>
                    <div className="order-svgs">
                        <span className="upside" onClick={sortPostsAsc}></span>
                        <span className="downside" onClick={sortPostsDesc}></span>
                    </div>
                    <div className="search2">
                        <input type="text" name='searchPosts' onKeyDown={(e) => searchPosts(e)} placeholder='search' />
                    </div>
                </div>
                {isLoading && <h3>Loading...</h3>}
                {errorMessage && <span>Correct Token is required to run the app.</span>}
                <div className='post-section'>
                    <nav>
                        {senderSearch && Object.entries(senderSearch).sort().map((it: any, i: number) => <Link key={i} to={`/posts/${it[0]}${location.search}`} onClick={postsList}>
                            <div className='senders'>
                                <p className='sender'>{it[0]}</p>
                                <span className='counts'>{it[1]}</span>
                            </div>
                        </Link>)}
                    </nav>
                    <section className='sec'>
                        {posts && posts.map((postItems: any, i: number) => <div className='msg' key={i}>
                            <p className='msg-time'>{dateFix(postItems.created_time)}</p>
                            <p className='msg-text'>{postItems.message}</p>
                        </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Posts;