import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {navigateActions} from "../../behavior/features/navigate/slice";
import {useAppSelector} from "../../behavior/store";

export const NavigateTo = () => {
    const to = useAppSelector(s => s.navigate.to)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const toCopy = to;
        if (toCopy) {
            dispatch(navigateActions.removeNavigate())
            // @ts-ignore
            navigate(toCopy)
        }
    }, [to])

    return null
};