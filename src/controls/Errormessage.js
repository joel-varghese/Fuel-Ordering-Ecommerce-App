import React from 'react'

const Errormessage = (props) => {
    const { guidelines , title , errors,isTouched } = props;
    return (
        <>
            {title ? <h6 className={props.styles ? props.styles.className : ''}>{title}</h6> : ''}
            <ul className='list-item-hld text-left'>
                {
                    Object.keys(guidelines).map((item, index) =>{
                        return (
                        !errors[item]  ? (
                            <li className={`list-group-item ${isTouched ? 'text-danger' : ''}`} key={item}>{guidelines[item]}</li>) : 
                            (
                            <li className="list-group-item text-success" key={item}>{guidelines[item]}</li>   
                            )
                    )})}

            </ul>
        </>
    )
}

export default Errormessage