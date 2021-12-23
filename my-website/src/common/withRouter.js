import {
    useLocation,
    useParams
} from "react-router-dom";

export function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let params = useParams();
        return (
            <Component
                 location = {location}
                params = {params}
                 {...props}
            />
        );
    }

    return ComponentWithRouterProp;
}