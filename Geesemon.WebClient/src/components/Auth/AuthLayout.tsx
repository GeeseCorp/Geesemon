import {Route, Routes} from "react-router-dom";
import {Auth} from "./Auth";

export function AuthLayout() {
    return (
        <Routes>
            <Route path="/auth/*" element={<Auth/>}/>
            <Route path="/*" element={<Auth/>}/>
        </Routes>
    );
}
