using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class NumericToAlphabet
    {
        public static readonly string Alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
        public static readonly int Base = Alphabet.Length;

        public static string Encode(int i)
        {
            if (i == 0) return Alphabet[0].ToString();
            var s = string.Empty;
            while (i > 0)
            {
                s += Alphabet[i % Base];
                i = i / Base;
            }
            return string.Join(string.Empty, s.Reverse());
        }
        public static int Decode(string s)
        {
            var i = 0;
            foreach (var c in s)
                i = (i * Base) + Alphabet.IndexOf(c);
            return i;
        }

        public static string ConvertNumricToAlphbet(int value)
        {
            string convertedValues = "";
            string content = value.ToString();
            for (int i = 0; i < content.Length; i++)
            {
                convertedValues += Encode(int.Parse(content[i].ToString()));
            }
            return convertedValues;
        }

        public static string ConvertNumricToAlphbet(string content)
        {
            string convertedValues = "";
            for (int i = 0; i < content.Length; i++)
            {
                convertedValues += Encode(int.Parse(content[i].ToString()));
            }
            return convertedValues;
        }

        public static string AlphbetToConvertNumric(string content)
        {
            string convertedValues = "";
            for (int i = 0; i < content.Length; i++)
            {
                convertedValues += Decode(content[i].ToString());
            }
            return convertedValues;
        }
    }
}
