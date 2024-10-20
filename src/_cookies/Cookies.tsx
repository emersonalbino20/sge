import * as React from 'react';
import Cookies from 'js-cookie';

export const setCookies = (key, value, timeLife, secure ) => {
    if(getCookies(key)){
        removeCookies(key)
    }
    Cookies.set(key, value, {
        expires: timeLife,
        secure: secure,
        sameSite: 'Strict'
    });
};

export const getCookies = (key) => {
    const token = Cookies.get(key);
    console.log('Token:', token);
    return token
};

export const removeCookies = (key) => {
    Cookies.remove(key);
};