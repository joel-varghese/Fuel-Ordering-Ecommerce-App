export const getAccessLevel = (userType, accessLevel) => {
    userType = userType.toLowerCase();
    accessLevel = JSON.parse(accessLevel)

    let accessLevelArray = ['admin', 'super', 'BF Super Admin']
    let result = null;
    switch(userType){
        case 'fbo':
            
            result = accessLevelArray.includes(accessLevel[0].toLowerCase())
            if(result ) {
                return true;
            } else {
                return false;
            }
        case 'operator':
            
            result = accessLevelArray.includes(accessLevel[0].toLowerCase())
            if(result ) {
                return true;
            } else {
                return false;
            }


        default: return true;

    }
}
export const getSuperAccess =(userType, accessLevel) =>{
    if(userType ==='Barrel Fuel'){
        return true;
    } else {
        accessLevel = JSON.parse(accessLevel)
        let accessLevelArray = [ 'super']
        let result = accessLevelArray.includes(accessLevel[0].toLowerCase())
        if(result ) {
            return true;
        } else {
            return false;
        }
    }
}

export const barrelFuelAccess =(userType, accessLevel) =>{
    userType = userType.toLowerCase();
    accessLevel = JSON.parse(accessLevel)

    let accessLevelArray = ['admin', 'super', 'BF Super Admin']
    if(accessLevelArray.includes(accessLevel[0].toLowerCase())){
        return false;
    } else {
        return true;
    }
}

export const getAdminAccess =(userType, accessLevel) =>{
        let accessLevelArray = [ 'admin']
        let result = accessLevelArray.includes(accessLevel[0].toLowerCase())
        if(result ) {
            return true;
        } else {
            return false;
        }
    
}