<template>
  <div>
    <el-row class="edit-box">
      <div>edit</div>
    </el-row>
    <el-row class="edit-box">
      <el-radio
        v-model="radio"
        :label="item.label"
        :key="item.label"
        v-for="item in list"
      >{{item.text}}</el-radio>
    </el-row>
    <el-row
      class="edit-box"
      :gutter="20"
      v-if="radio === 0 || radio === 1  "
    >
      <el-col :span="8">
        <el-input
          placeholder="key"
          v-model="key"
        />
      </el-col>
      <el-col :span="8">
        <el-input
          placeholder="value"
          v-model="value"
        />
      </el-col>
      <el-col :span="8">
        <el-button type="primary">新增</el-button>
      </el-col>
    </el-row>
    <el-row
      class="edit-box"
      :gutter="20"
      v-else-if="radio === 2"
    >
      <el-col :span="8">
        <el-input
          placeholder="key"
          v-model="key"
        />
      </el-col>
      <el-col :span="8">
        <el-select
          v-model="value"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-button type="primary">新增</el-button>
      </el-col>
    </el-row>
    <el-row
      class="edit-box"
      :gutter="20"
      v-else
    >
      <el-col :span="8">
        <el-input
          placeholder="key"
          v-model="key"
        />
      </el-col>
      <el-col :span="8">
        <el-button type="primary">新增</el-button>
      </el-col>
    </el-row>
    <el-row>
      <!-- <data-to-html :json="templateData"></data-to-html> -->
      <data-to-svg :json="templateData"></data-to-svg>
      <!-- <data-to-canvas :json="templateData"></data-to-canvas> -->
      <!-- <div v-for="item in templateData">
                <div v-for="i in item" v-if="Object.keys(item)">{{i}}</div>
            </div>-->
    </el-row>
  </div>
</template>

<script>
  import DataToHtml from "~/components/DataToHtml";
  import DataToSvg from "~/components/DataToSvg";
  import DataToCanvas from "~/components/DataToCanvas";
  import getType from "~/util/type";

  export default {
    data() {
      return {
        list: [
          {
            label: 0,
            text: "字符串"
          },
          {
            label: 1,
            text: "数字"
          },
          {
            label: 2,
            text: "布尔"
          },
          {
            label: 3,
            text: "数组"
          },
          {
            label: 4,
            text: "对象"
          },
          {
            label: 5,
            text: "模板"
          }
        ],
        options: [
          {
            value: true,
            text: "true"
          },
          {
            value: false,
            text: "false"
          }
        ],
        key: "",
        value: "",
        radio: 0,
        data: [],
        templateData: {
          // "data": {
          //     "list":[1,2,3,4,5,6],
          //     "applyStatus": 0,
          //     "customFieldList": null,
          //     "displayStatus": 1,
          //     "endCheckTime": null,
          //     "explanationTitle": "小雯首页测试活动",
          //     "explanationUrl": "http://1122.retail.n.saas.weimobqa.com/saas/retail/1122/1180222/shop/index?id=1877",
          //     "imageUrl": "http://cdn.weimob.com/saas/retail/manage/images/marketing/Bitmap.png",
          //     "isShowGetPhone": false,
          //     "merchantStatus": 1,
          //     "objection": null,
          //     "phone": 13333333333,
          //     "roleName": "团团张",
          //     "storeLogo": "https://image-c-dev.weimobwmc.com/qa-saas-wxbiz/7b718f7a7a994608a2b9f8849fa87384.jpg",
          //     "storeName": "QA微商城",
          //     "submitCheckTime": null,
          //     "weChatShare": {
          //     "content": "立即注册，社区团购优惠多多收益多多~",
          //     "imageUrl": "https://image-c-dev.weimobwmc.com/qa-saas-wxbiz/7b718f7a7a994608a2b9f8849fa87384.jpg",
          //     "shareUrl": {
          //         "h5Url": "http://1122.retail.n.saas.weimobqa.com/saas/retail/1122/1180222/market/community/chiefapplication?essharewid=4529856&shareChannel=1&rsShareWid=4529856",
          //         "miniUrl": "/pages/market/community/chiefapplication?essharewid=4529856&shareChannel=2&rsShareWid=4529856&storeId=1180222"
          //     },
          //     "title": "匿名邀请你成为QA微商城的团团张，快来看看吧~",
          //     "url": null
          //     }
          // },
          // "errcode": "0",
          // "errmsg": "处理成功",
          // "globalTicket": "7ada1be794af4402afc4270c173ef49b",
          // "monitorTrackId": null,
          obj: {
            list: [
              {
                id: "zhangsan",
                name: "张三"
              },
              {
                id: "lisi",
                name: "李四"
              }
            ]
            // arr:[1,2,3]
            // "shareUrl": {
            //     "h5Url": "http://1122.retail.n.saas.weimobqa.com/saas/retail/1122/1180222/market/community/chiefapplication?essharewid=4529856&shareChannel=1&rsShareWid=4529856",
            //     "miniUrl": "/pages/market/community/chiefapplication?essharewid=4529856&shareChannel=2&rsShareWid=4529856&storeId=1180222"
            // },
          }
        }
      };
    },
    components: {
      DataToHtml,
      DataToSvg,
      DataToCanvas
    },
    mounted() {},
    methods: {
      onAdd() {},
      onTranslation(obj) {
        let str = JSON.stringify(obj);
        str = str.replace(/{/g, (replacement, number, total) => {
          const before = [...total.slice(0, number)];
          let num = 0;
          before.forEach(item => {
            if (item === replacement) {
              num++;
            }
          });
          let suf = "";
          for (let i = 0; i < num; i++) {
            suf += `<span style='display:inline-block;width:20px;'></span>`;
          }
          return replacement + "<br/>" + suf;
        });
        str = str.replace(/}/g, (replacement, number, total) => {
          const before = [...total.slice(0, number)];
          let num = 0;
          before.forEach(item => {
            if (item === "{") {
              num++;
            }
            if (item === "}") {
              num--;
            }
          });
          num = num - 1;
          let suf = "";
          for (let i = 0; i < num; i++) {
            suf += `<span style='display:inline-block;width:20px;'></span>`;
          }
          return "<br/>" + suf + replacement;
        });
        str = str.replace(/,/g, (replacement, number, total) => {
          const before = [...total.slice(0, number)];
          let num = 0;
          before.forEach(item => {
            if (item === "{") {
              num++;
            }
            if (item === "}") {
              num--;
            }
          });
          num = num - 1;
          let suf = "";
          for (let i = 0; i < num; i++) {
            suf += `<span style='display:inline-block;width:20px;'></span>`;
          }
          return replacement + "<br/>" + suf;
        });
        return str;
      }
    }
  };
  // Object.prototype.toString  =() =>{

  // }
</script>

<style>
  .link {
    color: inherit;
    text-decoration: none;
  }
  .edit-box {
    margin: 10px;
  }
</style>
