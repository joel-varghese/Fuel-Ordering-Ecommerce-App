import { useEffect, useState } from "react"

const AviationFacts = props => {
    const [factsIndex, setfactsIndex] = useState(0)
    useEffect(()=>{
        let findex = Math.floor(Math.random() * (props?.facts?.aviationFactsList?.length) )
        setfactsIndex(findex ?findex :0)
    },[props.facts.aviationFactsList])
    return (
        <>
            <div className='bf-banner-img-placeholder'>{props.facts.aviationHeader}</div>
            <ul>
                {
                    <li><span> {props.facts.aviationFactsList[factsIndex].fact}</span></li>
                }
            </ul>
        </>
    )
}

export default AviationFacts;