import React, { useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../helpers/AuthContext"

function Profile() {
    const { id } = useParams()
    const [username, setUsername] = useState("")
    const [listOfPosts, setListOfPosts] = useState([])
    const navigate = useNavigate()
    const { authState } = useContext(AuthContext)
    useEffect(() => {
        axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((response) => {
            setUsername(response.data.username)
        })
        axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
            setListOfPosts(response.data)
        })
    }, [])
    return (
        <div className="profilePageContainer">
            <div className="basicInfo">
                <h1>Username: {username}</h1>
                {authState.username === username && <button onClick={() => { navigate("/changepassword") }}>change my password</button>}
            </div>
            <div className="listOfPosts">
                {
                    listOfPosts.map((value) => {
                        return (
                            <div className='post' key={value.id} >
                                <div className='title'>{value.title}</div>
                                <div className='body' onClick={() => { navigate(`/post/${value.id}`) }}>{value.postText}</div>
                                <div className='footer'>
                                    <div className="username">{value.username}</div>
                                    <div className="buttons">
                                        <label>{value.Likes.length}</label>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile