
<script>
import  getType,{isType} from '~/util/type'
import  {changeObjToArray} from '~/util/typeChange'
import  {DATATYPE} from '~/config/type'
const { isObj,isArr,isStr,isNum,isBool,isNull } = isType
export default {
    props:{
        json:Object
    },
    data(){return {
        width:'100%',
        height:'800px'
    }},
    render(h){
        return this.renderSvg(setSvgData(changeObjToArray(this.json)));
    },
    methods:{
        renderSvg(data){
            const { width,height}  = this;
          return <canvas></canvas>
        }
    }
}

function setSvgData(list){
    console.log(list)
   return list 
}
</script>

<style   scoped>

</style>
