tyrano.plugin.kag.stat.change_layer_order = {
    free: [],
    message: []
};


// 専用のメソッドを定義
$.change_layer_order = {

    // 実際にHTML要素をソートする
    sort: function(modified_elements){
        const j_after = modified_elements.map(cls => $(`.${cls}`));
        const j_top = j_after.shift();
        j_top.after(...j_after);
    },

    // 配列中に重複している要素の確認
    existsSameValue: function(a){
        const s = new Set(a);
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

        // config.tjsの値
        const config_layer_num = Number(content == 'free'? this.kag.config.numCharacterLayers : this.kag.config.numMessageLayers);

        // order属性が適切に指定されているか
        if (config_layer_num < order.length) {
            console.error('[Change Layer Order] order属性にしているレイヤ数がティラノに登録されているレイヤ数を超えています');
            return false;
        } else if (config_layer_num > order.length) {
            console.error('[Change Layer Order] order属性にしているレイヤ数がティラノに登録されているレイヤ数より少ないです');
            return false;
        }
        if ($.change_layer_order.existsSameValue(order)) {
            console.error('[Change Layer Order] order属性に重複している要素があります。');
            return false;
        }

        // 並び替える要素郡のClass
        const modified_elements = [];
        for (let i=0; i<order.length; i++) {
            let fore = `${order[i]}_fore`;
            let back = `${order[i]}_back`;
            if (content == "message") {
                fore = "message" + fore;
                back = "message" + back;
            }
            modified_elements.push(fore);
            modified_elements.push(back);
        }

        // 順番変更済の要素郡のClass名を stat に保存（make.ks用）
        this.kag.stat.change_layer_order[content] = modified_elements.map(v => v);
        //console.log(this.kag.stat.change_layer_order);

        // HTML要素を実際に操作
        $.change_layer_order.sort(modified_elements);

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
