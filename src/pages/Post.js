import axios from "axios"
import React, { useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../helpers/AuthContext"

function Post() {
    let { id } = useParams()
    const [postObject, setPostObject] = useState({})
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const { authState } = useContext(AuthContext)
    const navigate = useNavigate()
    useEffect(() => {
        axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
            setPostObject(response.data)
        })
        axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
            setComments(response.data)
        })
    }, [])
    const addComment = () => {
        const data = { commentBody: newComment, PostId: id }
        const config = { headers: { accessToken: localStorage.getItem("accessToken") } }
        axios.post("http://localhost:3001/comments", data, config).then((response) => {
            if (response.data.error) {
                console.log(response.data.error)
            } else {
                const commentToAdd = { commentBody: newComment, username: response.data.username }
                setComments([...comments, commentToAdd])
                setNewComment("")
            }
        })
    }
    const deleteComment = (id) => {
        const config = { headers: { accessToken: localStorage.getItem("accessToken") } }
        axios.delete(`http://localhost:3001/comments/${id}`, config).then((response) => {
            setComments(comments.filter((value) => {
                return value.id !== id
            }))
        })
    }
    const deletePost = (id) => {
        const config = { headers: { accessToken: localStorage.getItem("accessToken") } }
        axios.delete(`http://localhost:3001/posts/${id}`, config).then((response) => {
            navigate("/")
        })
    }
    const editPost = (option) => {
        if (option === "title") {
            const newTitle = prompt("enter new title: ")
            if (!newTitle) {
                return
            }
            const data = { id, newTitle }
            const config = { headers: { accessToken: localStorage.getItem("accessToken") } }
            axios.put("http://localhost:3001/posts/title", data, config).then((response) => {
                setPostObject({ ...postObject, title: newTitle })
            })
        } else {
            const newText = prompt("enter new post text: ")
            if (!newText) {
                return
            }
            const data = { id, newText }
            const config = { headers: { accessToken: localStorage.getItem("accessToken") } }
            axios.put("http://localhost:3001/posts/postText", data, config).then((response) => {
                setPostObject({ ...postObject, postText: newText })
            })
        }
    }
    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="title" onClick={() => { if (authState.username === postObject.username) { editPost("title") } }}>{postObject.title}</div>
                <div className="postText" onClick={() => { if (authState.username === postObject.username) { editPost("body") } }}>{postObject.postText}</div>
                <div className="footer">
                    {postObject.username}
                    {authState.username === postObject.username && <button onClick={() => { deletePost(postObject.id) }}>Delete Post</button>}
                </div>
            </div>
            <div className="rightSide">
                <div className="addCommentContainer">
                    <input type="text" placeholder="Comment..." autoComplete="off" value={newComment} onChange={(event) => { setNewComment(event.target.value) }} />
                    <button onClick={addComment}>Add Comment</button>
                </div>
                <div className="listOfComments">
                    {
                        comments.map((comment) => {
                            return (
                                <div className="comment" key={comment.id}>
                                    {comment.commentBody}
                                    <label>Username: {comment.username}</label>
                                    {authState.username === comment.username && <button onClick={() => { deleteComment(comment.id) }}>X</button>}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Post