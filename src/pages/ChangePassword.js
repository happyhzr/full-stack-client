import React, { useState } from "react"
import axios from "axios"

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const changePassword = () => {
        const data = { oldPassword, newPassword }
        const config = { headers: { accessToken: localStorage.getItem("accessToken") } }
        axios.put("http://localhost:3001/auth/changepassword", data, config).then((response) => {
            if (response.data.error) {
                alert(response.data.error)
            } else {
                console.log("change password successfully")
            }
        })
    }
    return (
        <div>
            <h1>change your password</h1>
            <input type="password" placeholder="old password" onChange={(event) => { setOldPassword(event.target.value) }} />
            <input type="password" placeholder="new password" onChange={(event) => { setNewPassword(event.target.value) }} />
            <button onClick={changePassword}>save changes</button>
        </div>
    )
}

export default ChangePassword