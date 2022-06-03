window.onload = function(){
    var p = document.getElementById("kingdom");
    if(p)
    {
        var kingdom = p.innerHTML;
        if(kingdom[0] == "J")
            document.getElementById("user-info").style.color = "blue";
         else if(kingdom[0] == "C")
            document.getElementById("user-info").style.color = "yellow";
         else if(kingdom[0] == "S")
            document.getElementById("user-info").style.color = "red";

        var username = document.getElementById("name").innerHTML;
        if(!localStorage.getItem(username+"-exp"))
        {
            localStorage.setItem(username+"-exp", "0");
            localStorage.setItem(username+"-lvl", "1");
        }
        var exp = localStorage.getItem(username+"-exp");
        exp = parseInt(exp);
        var lvl = localStorage.getItem(username+"-lvl");
        lvl = parseInt(lvl);

        var exp_needed_base = 20;
        var exp_needed = Math.floor(exp_needed_base * Math.pow(1.25, lvl-1));
        var exp_span = document.getElementById("exp");
        exp_span.innerHTML = exp;
        var exp_needed_span = document.getElementById("exp-needed");
        exp_needed_span.innerHTML = exp_needed;
        var lvl_span = document.getElementById("lvl");
        lvl_span.innerHTML = "Lv. " + lvl;
        var exp_gain_multiplier = Math.pow(1.15, lvl-1);

        var getExp = setInterval(function(){
            let exp_gain = Math.floor(Math.random()*20 * exp_gain_multiplier + 1);
            exp += exp_gain;
            if(exp >= exp_needed)
            {
                lvl++;
                exp -= exp_needed;
                exp_needed = Math.floor(exp_needed * 1.25);
                localStorage.setItem(username+"-lvl", lvl);
                lvl_span.innerHTML = "Lv. " + lvl;
                exp_gain_multiplier = Math.pow(1.15, lvl-1);
            }
            exp_span.innerHTML = exp;
            exp_needed_span.innerHTML = exp_needed;
            localStorage.setItem(username+"-exp", exp);


        }, 5000);
        var top = document.getElementById("top");
        var fms = document.getElementById("fms");
        var check = 0;
        fms.onclick = function(){
            if(check == 0)
            {
              check = 1;
              var create_buttons = setInterval(function(){
                  let nr = Math.floor(Math.random()*3 + 1);
                  for(let i = 0; i< nr; i++)
                  {
                      let width = Math.floor(Math.random()* document.body.clientWidth/3);
                      let height = Math.floor(Math.random()*60 - 30);
                      let exp_circle = document.createElement("span");
                      exp_circle.classList.add("circle");
                      exp_circle.innerHTML = "+" + (Math.floor((Math.random()*15 + 10)*exp_gain_multiplier));
                      exp_circle.style.top = height + "px";
                      exp_circle.style.left = width + "px";
                      exp_circle.style.backgroundColor = "rgb("+ Math.floor(Math.random()*256) + "," + Math.floor(Math.random()*256) + "," + Math.floor(Math.random()*256) + ")";
                      top.appendChild(exp_circle);

                      exp_circle.onclick = function(e){
                          e.stopPropagation();
                          if(e.target == e.currentTarget)
                          {
                              exp += parseInt(exp_circle.innerHTML.substring(1));
                              this.remove();

                              if(exp >= exp_needed)
                              {
                                  lvl++;
                                  exp -= exp_needed;
                                  exp_needed = Math.floor(exp_needed * 1.25);
                                  localStorage.setItem(username+"-lvl", lvl);
                                  lvl_span.innerHTML = "Lv. " + lvl;
                                  exp_gain_multiplier = Math.pow(1.15, lvl-1);
                              }
                              exp_span.innerHTML = exp;
                              exp_needed_span.innerHTML = exp_needed;
                              localStorage.setItem(username+"-exp", exp);
                          }
                      }

                      setTimeout(function(){
                          exp_circle.remove();
                      }, 3000);

                  }
              }, 4000);
            }
        }


        const cssObj = window.getComputedStyle(top, null);


    }

}
