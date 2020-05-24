var urllib=require('url');


function urlToArray(sitesdata) {
    let result=[];
    for(let item of sitesdata){
            let path=urllib.parse(item.url).path.split("/");
            path=path.filter(d=>d);
            if(path.length===0){
                continue;
            }
            //判断在数组中是否存在这个元素
            if(!inArrayFirst(path[0],result)){
                result.push({id:path[0],label:path[0]});
            }

            if(path.length===1){
                continue;
            }
            for(let i=0;i<path.length;i++){
                if(!inArrayOther(path[i],path[i-1],result)){
                    if(path[i-1]!==undefined){
                        result.push({id:path[i],label:path[i],parentId:path[i-1]});

                    }


                }

            }


    }
   // console.log(result);
    return result;


    
}


//判断无父元素的是否相等
function inArrayFirst(search,array){
    for(let i in array){
        if(array[i].hasOwnProperty('parentId')){

        }else{
            if(array[i].label===search){
                return true;
            }

        }

    }
    return false;
}

//判断有父元素的是否相等
function inArrayOther(curentsearch,parentsearch,array){
    for(let i in array){
        if(array[i].hasOwnProperty('parentId')){
            if(array[i].label===curentsearch&&array[i].parentId===parentsearch){
                return true;
            }

        }else{


        }

    }
    return false;
}



function translateDataToTree(data) {
    let parents = data.filter(value => value.parentId == 'undefined' || value.parentId == null)
    let children = data.filter(value => value.parentId !== 'undefined' && value.parentId != null)
    let translator = (parents, children) => {
        parents.forEach((parent) => {
                children.forEach((current, index) => {
                        if (current.parentId === parent.id) {
                            let temp = JSON.parse(JSON.stringify(children))
                            temp.splice(index, 1)
                            translator([current], temp)
                            typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
                        }
                    }
                )
            }
        )
    }
    translator(parents, children)
    return parents
}

exports.urlToArray=urlToArray;
exports.translateDataToTree=translateDataToTree;
