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
        img.add(overlay).attr('src', url);
        set_position();
    }

    var marker_update = function(){
        marker.find(".offset").text(offset);
        marker.find(".scale").text(Math.round(scale*100));
    }
    marker_update();

    var set_position = function(delta) {
        offset = Math.min(orig_width, Math.max(0, offset + delta));
        overlay.add(marker).css('left', offset * scale);
        marker_update();
    }

    var set_scale = function(delta) {
        if (orig_width) {
            var imgs = img.add(overlay);
            scale *= Math.pow(1.1, delta);
            imgs.width(orig_width * scale);
            set_position(0);
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
            set_position(e.pageX - start_x);
            start_x = e.pageX;
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
});

