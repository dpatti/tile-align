$(function(){
    var offset = 100;
    var scale = 1;
    var orig_width;
    var img = $("#static").load(function(){ orig_width = $(this).width(); });
    var overlay = $("#overlay").css('left', offset);
    var marker = $("#marker").css('left', offset);
    orig_width = img.width() || null;
    
    var load_image = function(url) {
        orig_width = null;
        scale = 1;
        offset = 100;
        set_position();
        img.add(overlay).css('width', '').attr('src', url);
    }

    var marker_update = function(){
        if (!marker.find(".offset input").length)
            marker.find(".offset").text(offset);
        marker.find(".scale").text(Math.round(scale*100));
    }
    marker_update();

    var set_position = function(delta) {
        if (orig_width && delta)
            offset = Math.min(orig_width, Math.max(0, offset + delta));
        overlay.add(marker).css('left', offset * scale);
        marker_update();
    }

    var set_scale = function(delta) {
        if (!delta)
            delta = 0;
        if (orig_width) {
            var imgs = img.add(overlay);
            scale *= Math.pow(1.1, delta);
            imgs.width(orig_width * scale);
            set_position();
        }
    }

    // Interface
    $("#url").keydown(function(e){
        if (e.keyCode == 13) {
            load_image($(this).val());
        }
    });
    $("#load").click(function(){
        load_image($(this).prev().val());
    });
    
    // Key
    $(document).keydown(function(e){
        if (e.keyCode >= 37 && e.keyCode <= 40)
            e.preventDefault();

        var shamt = e.shiftKey ? 10 : 1;
        if (e.keyCode == 37)
            set_position(-shamt);
        else if (e.keyCode == 39)
            set_position(shamt);
        else if (e.keyCode == 38)
            set_scale(-1);
        else if (e.keyCode == 40)
            set_scale(+1);
    });

    // Dragging
    var start_x=null;
    $(overlay).mousedown(function(e){
        start_x = e.pageX;
    });
    $(document).mousemove(function(e){
        if (start_x != null) {
            var diff = Math.round((e.pageX - start_x) / scale);
            if (Math.abs(diff) >= 1) {
                set_position(diff);
                start_x += diff * scale;
            }
        }
    }).mouseup(function(){
        start_x = null;
    })

    // Lights
    $(document).on('click', "a.lights", function(){
        $("body").css({
            backgroundColor: $(this).is(".off") ? '#000' : '#fff',
            color:           $(this).is(".off") ? '#fff' : '#000',
        });
        var other = $("span.lights");
        other.replaceWith($("<a>").text(other.text()).addClass(other.attr('class')).attr('href', 'javascript:;'));
        $(this).replaceWith($("<span>").text($(this).text()).addClass($(this).attr('class')));
    });

    // Manual editing
    marker.find(".offset").click(function(){
        if ($(this).find("input").length == 0) {
            $(this).text('').append(
                $("<input>")
                    .attr('maxlen', 4)
                    .attr('size', 2)
                    .val(offset)
                    .change(function(){
                        offset = parseInt($(this).val()) || 0;
                        set_position();
                        // Re-set value in case it was bounded
                        $(this).val(offset);
                        this.select();
                        this.focus();
                    }).blur(function(){
                        $(this).parent().text($(this).val());
                    })
            );
            var inpt = $(this).find("input").get(0);
            inpt.select();
            inpt.focus();
        }
    });
});

