using System.Collections.Generic;

 public  class HintManager
 {
    private Dictionary<(int,int), Hint> hints = new()
    {
        {(0,0), new Hint(new[]{(1,1,"move towards right")})},
        {(0,1), new Hint(new[]{(2,2,"start Here")})},
        {(0,2), new Hint(new[]{(3,3,"start Here")})},
        {(1,0), new Hint(new[]{(9,0,"start Here")})},
        {(1,1), new Hint(new[]{(9,1,"start Here")})},
        {(1,2), new Hint(new[]{(9,2,"start Here")})},
        {(2,0), new Hint(new[]{(7,7,"start Here")})},
        {(2,1), new Hint(new[]{(8,8,"start Here")})},
        {(2,2), new Hint(new[]{(9,9,"start Here")})},

    };
    public bool TryGetHint(int keyX, int keyY, out Hint hint)
        {
            return hints.TryGetValue((keyX, keyY), out hint);
        }

 }
