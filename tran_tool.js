var operateImg = function () { }

operateImg.prototype = {
    start: [],
    num: 1,
    x: 0,
    y: 0,
    transInfo: [],
    isTwoFing: false,
    options:null,
    TRAN: {
        SCALEX:0,
        ROTATEX:1,
        ROTATEY:2,
        SCALEY:3,
        OFFSETX:4,
        OFFSETY:5,
    },
    init: function (options) {
        this.options = options,
        this.initEnvet();
    },
    initEnvet: function (){
        var self = this;
        var opPlan = self.options.opPlan;
        var img = self.options.img;
        $(opPlan).on("touchstart",function(e){
            var touches = e.originalEvent.touches;
            self.start = touches;
            if (touches.length > 1) {
                e.preventDefault();
                self.isTwoFing = true;
            }
            var transTemp = $(img).css('transform').substring(7).split(',');
            self.transInfo = [];
            for(var i =0; i<transTemp.length; i++){
                self.transInfo.push(parseFloat(transTemp[i]));
            }
            self.x = self.transInfo[self.TRAN.OFFSETX];
            self.y = self.transInfo[self.TRAN.OFFSETY];
            self.num = self.transInfo[self.TRAN.SCALEX];
        });

        $(opPlan).on("touchend",function(e) {
            if(e.originalEvent.touches.length == 0){
                self.isTwoFing = false;
            }
        })

        $(opPlan).on("touchmove",function(e){
            e.preventDefault();
            //一根 手指 执行 目标元素移动 操作
            var touches = e.originalEvent.touches;
            if (touches.length == 1 && !self.isTwoFing) {
                //平移
                if(self.getDistance(self.start[0], touches[0])<2){
                    return;
                }
                self.x = touches[0].pageX-self.start[0].pageX+self.x;
                self.y = touches[0].pageY-self.start[0].pageY+self.y;
                $(img).css('transform','translate('+ self.x +'px,'+self.y+'px) scale('+self.num+')');
                self.start = touches
            };
            // 2 根 手指执行 目标元素放大操作
            if (touches.length >= 2 ) {
                //得到第二组两个点
                var now = touches;
                // 当前距离变小， getDistance 是勾股定理的一个方法
                var dis1 = self.getDistance(now[0], self.start[0]);
                var dis2 = self.getDistance(now[1], self.start[1]);
                if(dis1+dis2<2){
                    return;
                }
                if(self.getDistance(now[0], now[1]) < self.getDistance(self.start[0], self.start[1])){
                    //缩小
                    if(self.num>0.4){
                        self.num-=0.02;
                        $(img).css('transform','translate('+ self.x +'px,'+self.y+'px) scale('+self.num+')');
                    }
                }else{
                    //放大
                    if(self.num<2){
                        self.num+=0.02;
                        $(img).css('transform','translate('+ self.x +'px,'+self.y+'px) scale('+self.num+')');
                    }

                };
                self.start = now;
            };
        })
    },

    getDistance: function(p1, p2) {
        var x = p2.pageX - p1.pageX,
            y = p2.pageY - p1.pageY;
        return Math.sqrt((x * x) + (y * y));
    },
}
