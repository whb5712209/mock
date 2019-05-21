
<script>
import  getType,{isType} from '~/util/type'
import  {DATATYPE} from '~/config/type'
const { isObj,isArr,isStr,isNum,isBool,isNull } = isType
export default {
    props:{
        json:Object
    },
    data(){return {}},
    render(h){
        const str =  this.renderHtml(this.json);
        console.log(str)
        return str
    },
    methods:{
        renderHtml(data){
          if(isArr(data)){
            return data.map((item,index)=>{
              if( (isStr(item)||isNum(item)||isBool(item))){
                if(isStr(item)){
                  return <p class='text'>{`'${item}'`}{data.length - 1 === index?'':','}</p>    
                }
                return <p class='text'>{item}{data.length - 1 === index?'':','}</p>    
              }
              if(isObj(item)){
                return  <li class={`json-item obj`}>
                          <span class={`title obj`} ></span>
                          {
                         this.renderHtml(item)
                          }
                        </li>
              }
              return this.renderHtml(item)
            })
          }
          if(isNull(data)){
             return <span class='text'>null,</span>    
          }
          const dataKey = Object.keys(data)
          return  <div>
                {
                    dataKey.map((item,index)=>{
                      return <ul class='json-ul' >
                              <li class={`json-item ${isArr(data[item]) ?'arr':''} ${isObj(data[item]) ?'obj':''}`}>
                                  <span class={`title ${isArr(data[item]) ?'arr':''} ${isObj(data[item]) ?'obj':''}`} > {item}:</span>
                                {
                                  isStr(data[item])?
                                   <span class='text'>'{data[item]}'{dataKey.length - 1 === index?'':','}</span>
                                  :isBool(data[item])?
                                  <span class='text'>{data[item]?'true':'false'}{dataKey.length - 1 === index?'':','}</span>
                                  :isNum(data[item])?
                                        <span class='text'>{data[item]}{dataKey.length - 1 === index?'':','}</span>
                                        :this.renderHtml(data[item])
                                  }
                              </li>
                          </ul>
                  })
              }
          </div>
        }
    }
}
</script>

<style   scoped>
.json-ul{
  list-style: none;
  padding: 0;
  margin: 5px 10px;
}
 
.title{
      color: #333;
    font-size: 20px;
}
.text{
   color: #666;
    font-size: 16px;
    padding: 0 10px 0;

}
.title.arr::after{
  content: '['
}
.json-item.arr::after{
  content: '],'
}
.title.obj::after{
  content: '{'
}
.json-item.obj::after{
   content: '},'
}
.json-item{
  padding: 0 0 0 10px;
}
</style>
