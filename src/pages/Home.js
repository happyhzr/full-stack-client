import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { AuthContext } from "../helpers/AuthContext"

function Home() {
    const [listOfPosts, setListOfPosts] = useState([])
    const [likedPosts, setLikedPosts] = useState([])
    const { authState } = useContext(AuthContext)
    const navigate = useNavigate()
    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login")
        } else {
            const config = { headers: { accessToken: localStorage.getItem("accessToken") } }
            axios.get("http://localhost:3001/posts", config).then((response) => {
                setListOfPosts(response.data.listOfPosts)
                setLikedPosts(response.data.likedPosts.map(like => like.id))
            })
        }
    }, [])
    const likePost = (postId) => {
        const data = { PostId: postId }
        const config = { headers: { accessToken: localStorage.getItem("accessToken") } }
        axios.post("http://localhost:3001/likes", data, config).then((response) => {
            setListOfPosts(listOfPosts.map((post) => {
                if (post.id === postId) {
                    if (response.data.liked) {
                        return { ...post, Likes: [...post.Likes, 0] }
                    } else {
                        const likesArray = post.Likes
                        likesArray.pop()
                        return { ...post, Likes: likesArray }
                    }
                } else {
                    return post
                }
            }))
            if (likedPosts.includes(postId)) {
                setLikedPosts(likedPosts.filter(id => id !== postId))
            } else {
                setLikedPosts([...likedPosts, postId])
            }
        })
    }
    return (
        <div>
            {
                listOfPosts.map((value) => {
                    return (
                        <div className='post' key={value.id} >
                            <div className='title'>{value.title}</div>
                            <div className='body' onClick={() => { navigate(`/post/${value.id}`) }}>{value.postText}</div>
                            <div className='footer'>
                                <div className="username">
                                    <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
                                </div>
                                <div className="buttons">
                                    <ThumbUpAltIcon onClick={() => { likePost(value.id) }} className={likedPosts.includes(value.id) ? "" : ""} />
                                    <label>{value.Likes.length}</label>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Home