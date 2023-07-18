import "./loader.scss";

const Loader = props => {
    return (
        <div className={`d-flex align-items-center justify-content-center ${props.height ? '' : 'w100 h100'}`}>
            <div class="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}
export default Loader;