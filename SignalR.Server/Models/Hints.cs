    public class Hint
    {
        public (int X, int Y, string HintText)[] Hints { get; }

        public Hint((int, int, string)[] hints)
        {
            Hints = hints;
        }

        public bool Matches(int x, int y, out string hintText)
        {
            foreach (var (hintX, hintY, text) in Hints)
            {
                if (hintX == x && hintY == y)
                {
                    hintText = text;
                    return true;
                }
            }
            hintText = "";
            return false;
        }
    }