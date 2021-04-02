tyrano.plugin.kag.stat.change_layer_order = {
    free: [],
    message: []
};


// 専用のメソッドを定義
$.change_layer_order = {

    // 現在表示されているHTML要素を返す
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

    // 実際にHTML要素をソートする
    sort: function(modified_elements_class){
        const j_after = modified_elements_class.map(cls => $(`.${cls}`));
        const j_top = j_after.shift();
        j_top.after(...j_after);
    },

    // 配列中に重複している要素の確認
    existsSameValue: function(a){
        var s = new Set(a);
        return s.size != a.length;
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
        if ($.change_layer_order.existsSameValue(order)) {
            console.error('[Change Layer Order] order属性に重複している要素があります。');
            return false;
        }

        // 順番を変更する元の要素郡を取得
        const origin_elements = $.change_layer_order.getOriginElements(content);
        //for (let e of origin_elements) console.log($(e).attr('class'));

        // 要素郡の順番を変更
        const modified_elements = [];
        order.forEach(num => {
            let fore, back;
            for (let e of origin_elements) {
                const cl = $(e).attr('class');
                if (cl.indexOf(`${num}_fore`) !== -1) fore = e;
                else if (cl.indexOf(`${num}_back`) !== -1) back = e;
            }
            modified_elements.push(fore);
            modified_elements.push(back);
        });
        //console.log(modified_elements);

        // 順番変更済の要素郡からClass名を抽出
        const modified_elements_class = modified_elements.map(e => $(e).attr('class').split(' ')).map(cl => cl.filter(v => (v.indexOf('_fore') !== -1 || v.indexOf('_back') !== -1) && v.indexOf('layer') === -1).shift());
        //console.log(modified_elements_class);

        // 順番変更済の要素郡のClass名を stat に保存（make.ks用）
        this.kag.stat.change_layer_order[content] = modified_elements_class.map(v => v);
        //console.log(this.kag.stat.change_layer_order);

        // HTML要素を実際に操作
        $.change_layer_order.sort(modified_elements_class);

        this.kag.ftag.nextOrder();

    }

};


tyrano.plugin.kag.tag.make_change_layer_order = {

    start: function(pm) {

        const free = this.kag.stat.change_layer_order.free;
        const message = this.kag.stat.change_layer_order.message;
        
        if (free.length === Number(this.kag.config.numCharacterLayers)) $.change_layer_order.sort(free);
        if (message.length === Number(this.kag.config.numMessageLayers)) $.change_layer_order.sort(message);

        this.kag.ftag.nextOrder();

    }

};


['change_layer_order', 'make_change_layer_order'].forEach(tag_name => {
    tyrano.plugin.kag.ftag.master_tag[tag_name] = object(tyrano.plugin.kag.tag[tag_name]);
    tyrano.plugin.kag.ftag.master_tag[tag_name].kag = TYRANO.kag;
});
