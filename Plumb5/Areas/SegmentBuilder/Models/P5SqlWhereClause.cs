namespace Plumb5.Areas.SegmentBuilder.Models
{
    public class P5SqlWhereClause
    {
        private P5SqlLogicOperator m_LogicOperator;
        private string m_FieldName;
        private P5SqlComparison m_ComparisonOperator;
        private object m_Value;
        private int m_Level;
        private string m_DataTye;

        public P5SqlLogicOperator LogicOperator
        {
            get { return m_LogicOperator; }
            set { m_LogicOperator = value; }
        }

        /// <summary>
        /// Gets/sets the name of the database column this WHERE clause should operate on
        /// </summary>
        public string FieldName
        {
            get { return m_FieldName; }
            set { m_FieldName = value; }
        }

        public string DataTye
        {
            get { return m_DataTye; }
            set { m_DataTye = value; }
        }

        /// <summary>
        /// Gets/sets the comparison method
        /// </summary>
        public P5SqlComparison ComparisonOperator
        {
            get { return m_ComparisonOperator; }
            set { m_ComparisonOperator = value; }
        }

        /// <summary>
        /// Gets/sets the value that was set for comparison
        /// </summary>
        public object Value
        {
            get { return m_Value; }
            set { m_Value = value; }
        }

        public int Level
        {
            get { return m_Level; }
            set { m_Level = value; }
        }
    }
}
