// 廃止
// 一度全ての要素をremoveしてorder順に再表示する

tyrano.plugin.kag.stat.change_layer_order = {
    free: [],
    message: []
};


// 専用のメソッドを定義
$.change_layer_order = {

    getOriginElements: function(content){
        let origin_elements;
        if (content == 'free') {
            const elem = $('#root_layer_game').children();
            origin_elements = elem.filter(layer => $(elem[layer]).attr('class').indexOf('base') === -1);
        } else if (content == 'message') {
            const elem = $('#root_layer_system').children();
            origin_elements = elem.filter(layer => $(elem[layer]).attr('class').indexOf('message') !== -1);
        }
        return origin_elements;
    },

    sort: function(content, order){
        const origin_elements = this.getOriginElements(content);
        let origin_elements_class = [];
        for (let e of origin_elements) origin_elements_class.push($(e).attr('class').split(' ').filter(v => (v.indexOf('_fore') !== -1 || v.indexOf('_back') !== -1) && v.indexOf('layer') === -1).shift());
        origin_elements_class.forEach(cl => $(`.${cl}`).remove());
        order.forEach(layer => {
            const target_id = content == 'free'? '#root_layer_game' : '#root_layer_system';
            const element = origin_elements.filter(index => {
                const elem = origin_elements[index];
                if ($(elem).attr('class').indexOf(`${layer}_`) !== -1) return elem;
            });
            for (let e of element) $(target_id).append(e);
        });
    }

}


tyrano.plugin.kag.tag.change_layer_order = {

    pm: {

        content: 'free',  // free, message
        order: ''

    },

    start: function(pm) {

        const content = pm.content;
        const order = pm.order.split(',');

        // order属性が適切に指定されているか
        if ((content == 'free'? Number(this.kag.config.numCharacterLayers) : Number(this.kag.config.numMessageLayers)) < order.length) {
            console.error('[Change Layer Order] order属性にしているレイヤ数がティラノに登録されているレイヤ数を超えています');
            return false;
        } else if ((content == 'free'? Number(this.kag.config.numCharacterLayers) : Number(this.kag.config.numMessageLayers)) > order.length) {
            console.error('[Change Layer Order] order属性にしているレイヤ数がティラノに登録されているレイヤ数より少ないです');
            return false;
        }

        // order属性を stat に保存
        this.kag.stat.change_layer_order[content] = order.map(v => v);
        //console.log(this.kag.stat.change_layer_order);

        // HTML要素を実際に操作
        $.change_layer_order.sort(content, order);

        this.kag.ftag.nextOrder();

    }

};


tyrano.plugin.kag.tag.make_change_layer_order = {

    start: function(pm) {

        const free = this.kag.stat.change_layer_order.free;
        const message = this.kag.stat.change_layer_order.message;
        
        if (free.length === Number(this.kag.config.numCharacterLayers)) $.change_layer_order.sort("free");
        if (message.length === Number(this.kag.config.numMessageLayers)) $.change_layer_order.sort("message");

        this.kag.ftag.nextOrder();

    }

};


['change_layer_order', 'make_change_layer_order'].forEach(tag_name => {
    tyrano.plugin.kag.ftag.master_tag[tag_name] = object(tyrano.plugin.kag.tag[tag_name]);
    tyrano.plugin.kag.ftag.master_tag[tag_name].kag = TYRANO.kag;
});