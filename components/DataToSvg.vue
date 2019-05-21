
<script>
  import getType, { isType } from "~/util/type";
  import {
    changeObjToArray,
    addTag,
    setHierarchy,
    onLocal
  } from "~/util/typeChange";
  import { DATATYPE } from "~/config/type";
  import { generateUUID } from "~/util/uuid";
  const { isObj, isArr, isStr, isNum, isBool, isNull } = isType;

  export default {
    props: {
      json: Object
    },
    data() {
      return {
        width: "100%",
        height: "800px",
        num: 0,
        source: changeObjToArray(this.json),
        list: []
      };
    },
    render(h) {
      return this.renderSvg(setSvgData(this.list));
    },
    beforeMount() {
      let arr = changeObjToArray(this.json);
      arr = addTag(arr);
      arr = setHierarchy(arr);
      arr = onLocal(arr);
      console.log(arr);
      debugger;
      this.list = arr;
      //   console.log(arr);
      //   if (this.num === 0) {
      //     this.list[this.num] = [this.source[this.num]];
      //   }
    },
    methods: {
      renderSvg(data) {
        const { width, height, list } = this;
        return (
          <svg ref="svg" width={width} height={height}>
            <rect
              x="-10%"
              y="-10%"
              width="110%"
              height="110%"
              fill="#eee"
              pointer-events="all"
            />
            {list.map((item, index) => {
              return item.map((i, inx) => {
                return (
                  <g transform={i.transform} class="123" key={i.id}>
                    <circle
                      data-v-ef75a942=""
                      cx="100"
                      cy="25"
                      r="25"
                      fill="rgba(15,125,110,0.8)"
                      stroke="rgba(195,197,12,0.8)"
                      stroke-width="2"
                    />
                    <text fill="#000" y="-10" x="100" text-anchor="middle">
                      {i.name}
                    </text>
                  </g>
                );
              });
            })}
          </svg>
        );
      }
    }
  };

  /**
   * 将嵌套拉平
   */
  function setSvgData(list) {
    return list;
  }
  const keys = ["id", "key", "name", "num", "parentId", "title", "type"];
</script>

<style   scoped>
</style>
