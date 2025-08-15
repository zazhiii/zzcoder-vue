// request header
// Authorization: ApiKey zazhi:a355c7ed82cbaf55153bce5eb9bab1d0d2f0c1af

// Param query
// /?username=zazhi&api_key=a355c7ed82cbaf55153bce5eb9bab1d0d2f0c1af

import axios from "axios"

export const getUpcomingContests = (resource__regex) => {
    return axios.get(`https://clist.by/api/v4/contest/?upcoming=true&resource__regex=${resource__regex}&order_by=start`, {
        headers: {
            Authorization: "ApiKey zazhi:a355c7ed82cbaf55153bce5eb9bab1d0d2f0c1af"
        },
        params: {
            username: "zazhi",
            api_key: "a355c7ed82cbaf55153bce5eb9bab1d0d2f0c1af"
        }
    })
}