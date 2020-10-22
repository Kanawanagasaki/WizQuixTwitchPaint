namespace WizQuixTwitchPaint
{
    partial class Form1
    {
        /// <summary>
        /// Обязательная переменная конструктора.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Освободить все используемые ресурсы.
        /// </summary>
        /// <param name="disposing">истинно, если управляемый ресурс должен быть удален; иначе ложно.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Код, автоматически созданный конструктором форм Windows

        /// <summary>
        /// Требуемый метод для поддержки конструктора — не изменяйте 
        /// содержимое этого метода с помощью редактора кода.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.MainContainer = new System.Windows.Forms.SplitContainer();
            this.ControlSplitter = new System.Windows.Forms.SplitContainer();
            this.tableLayoutPanel1 = new System.Windows.Forms.TableLayoutPanel();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.UsernameTextbox = new System.Windows.Forms.TextBox();
            this.AccessTokenTextbox = new System.Windows.Forms.TextBox();
            this.ConnectButton = new System.Windows.Forms.Button();
            this.label4 = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.label6 = new System.Windows.Forms.Label();
            this.ChannelTextbox = new System.Windows.Forms.TextBox();
            this.MessagedPeriodTextbox = new System.Windows.Forms.TextBox();
            this.TickTimer = new System.Windows.Forms.Timer(this.components);
            this.TwitchTimer = new System.Windows.Forms.Timer(this.components);
            this.ImageSelectionButton = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.MainContainer)).BeginInit();
            this.MainContainer.Panel2.SuspendLayout();
            this.MainContainer.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.ControlSplitter)).BeginInit();
            this.ControlSplitter.Panel1.SuspendLayout();
            this.ControlSplitter.SuspendLayout();
            this.tableLayoutPanel1.SuspendLayout();
            this.SuspendLayout();
            // 
            // MainContainer
            // 
            this.MainContainer.Dock = System.Windows.Forms.DockStyle.Fill;
            this.MainContainer.FixedPanel = System.Windows.Forms.FixedPanel.Panel2;
            this.MainContainer.IsSplitterFixed = true;
            this.MainContainer.Location = new System.Drawing.Point(0, 0);
            this.MainContainer.Name = "MainContainer";
            // 
            // MainContainer.Panel1
            // 
            this.MainContainer.Panel1.Paint += new System.Windows.Forms.PaintEventHandler(this.splitContainer1_Panel1_Paint);
            this.MainContainer.Panel1.MouseDown += new System.Windows.Forms.MouseEventHandler(this.MainContainer_Panel1_MouseDown);
            this.MainContainer.Panel1.MouseMove += new System.Windows.Forms.MouseEventHandler(this.MainContainer_Panel1_MouseMove);
            this.MainContainer.Panel1.MouseUp += new System.Windows.Forms.MouseEventHandler(this.MainContainer_Panel1_MouseUp);
            // 
            // MainContainer.Panel2
            // 
            this.MainContainer.Panel2.Controls.Add(this.ControlSplitter);
            this.MainContainer.Size = new System.Drawing.Size(970, 720);
            this.MainContainer.SplitterDistance = 720;
            this.MainContainer.TabIndex = 99;
            // 
            // ControlSplitter
            // 
            this.ControlSplitter.Dock = System.Windows.Forms.DockStyle.Fill;
            this.ControlSplitter.FixedPanel = System.Windows.Forms.FixedPanel.Panel2;
            this.ControlSplitter.IsSplitterFixed = true;
            this.ControlSplitter.Location = new System.Drawing.Point(0, 0);
            this.ControlSplitter.Name = "ControlSplitter";
            this.ControlSplitter.Orientation = System.Windows.Forms.Orientation.Horizontal;
            // 
            // ControlSplitter.Panel1
            // 
            this.ControlSplitter.Panel1.Controls.Add(this.tableLayoutPanel1);
            // 
            // ControlSplitter.Panel2
            // 
            this.ControlSplitter.Panel2.Paint += new System.Windows.Forms.PaintEventHandler(this.splitContainer1_Panel2_Paint);
            this.ControlSplitter.Panel2.MouseClick += new System.Windows.Forms.MouseEventHandler(this.ControlSplitter_Panel2_MouseClick);
            this.ControlSplitter.Size = new System.Drawing.Size(246, 720);
            this.ControlSplitter.SplitterDistance = 420;
            this.ControlSplitter.TabIndex = 0;
            // 
            // tableLayoutPanel1
            // 
            this.tableLayoutPanel1.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.tableLayoutPanel1.AutoSize = true;
            this.tableLayoutPanel1.ColumnCount = 2;
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 50F));
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 50F));
            this.tableLayoutPanel1.Controls.Add(this.label1, 0, 0);
            this.tableLayoutPanel1.Controls.Add(this.label2, 0, 1);
            this.tableLayoutPanel1.Controls.Add(this.label3, 0, 2);
            this.tableLayoutPanel1.Controls.Add(this.UsernameTextbox, 1, 1);
            this.tableLayoutPanel1.Controls.Add(this.AccessTokenTextbox, 1, 2);
            this.tableLayoutPanel1.Controls.Add(this.ConnectButton, 0, 6);
            this.tableLayoutPanel1.Controls.Add(this.label4, 0, 3);
            this.tableLayoutPanel1.Controls.Add(this.label5, 0, 4);
            this.tableLayoutPanel1.Controls.Add(this.label6, 0, 5);
            this.tableLayoutPanel1.Controls.Add(this.ChannelTextbox, 1, 4);
            this.tableLayoutPanel1.Controls.Add(this.MessagedPeriodTextbox, 1, 5);
            this.tableLayoutPanel1.Controls.Add(this.ImageSelectionButton, 0, 7);
            this.tableLayoutPanel1.Location = new System.Drawing.Point(3, 3);
            this.tableLayoutPanel1.Name = "tableLayoutPanel1";
            this.tableLayoutPanel1.RowCount = 8;
            this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle());
            this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle());
            this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle());
            this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle());
            this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle());
            this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle());
            this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle());
            this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle());
            this.tableLayoutPanel1.Size = new System.Drawing.Size(231, 191);
            this.tableLayoutPanel1.TabIndex = 0;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.tableLayoutPanel1.SetColumnSpan(this.label1, 2);
            this.label1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.label1.Font = new System.Drawing.Font("Arial", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.label1.ForeColor = System.Drawing.Color.White;
            this.label1.Location = new System.Drawing.Point(3, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(225, 14);
            this.label1.TabIndex = 0;
            this.label1.Text = "Twitch Credentials";
            this.label1.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Dock = System.Windows.Forms.DockStyle.Fill;
            this.label2.Font = new System.Drawing.Font("Arial", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.label2.ForeColor = System.Drawing.Color.White;
            this.label2.Location = new System.Drawing.Point(3, 14);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(109, 26);
            this.label2.TabIndex = 1;
            this.label2.Text = "Username";
            this.label2.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Dock = System.Windows.Forms.DockStyle.Fill;
            this.label3.Font = new System.Drawing.Font("Arial", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.label3.ForeColor = System.Drawing.Color.White;
            this.label3.Location = new System.Drawing.Point(3, 40);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(109, 26);
            this.label3.TabIndex = 2;
            this.label3.Text = "Access Token";
            this.label3.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // UsernameTextbox
            // 
            this.UsernameTextbox.Font = new System.Drawing.Font("Arial", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.UsernameTextbox.Location = new System.Drawing.Point(118, 17);
            this.UsernameTextbox.Name = "UsernameTextbox";
            this.UsernameTextbox.Size = new System.Drawing.Size(110, 20);
            this.UsernameTextbox.TabIndex = 0;
            // 
            // AccessTokenTextbox
            // 
            this.AccessTokenTextbox.Font = new System.Drawing.Font("Arial", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.AccessTokenTextbox.Location = new System.Drawing.Point(118, 43);
            this.AccessTokenTextbox.Name = "AccessTokenTextbox";
            this.AccessTokenTextbox.PasswordChar = '*';
            this.AccessTokenTextbox.Size = new System.Drawing.Size(110, 20);
            this.AccessTokenTextbox.TabIndex = 4;
            // 
            // ConnectButton
            // 
            this.tableLayoutPanel1.SetColumnSpan(this.ConnectButton, 2);
            this.ConnectButton.Dock = System.Windows.Forms.DockStyle.Fill;
            this.ConnectButton.Location = new System.Drawing.Point(3, 135);
            this.ConnectButton.Name = "ConnectButton";
            this.ConnectButton.Size = new System.Drawing.Size(225, 24);
            this.ConnectButton.TabIndex = 5;
            this.ConnectButton.Text = "Connect";
            this.ConnectButton.UseVisualStyleBackColor = true;
            this.ConnectButton.Click += new System.EventHandler(this.ConnectButton_Click);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.tableLayoutPanel1.SetColumnSpan(this.label4, 2);
            this.label4.Dock = System.Windows.Forms.DockStyle.Fill;
            this.label4.Font = new System.Drawing.Font("Arial", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.label4.ForeColor = System.Drawing.Color.White;
            this.label4.Location = new System.Drawing.Point(3, 66);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(225, 14);
            this.label4.TabIndex = 6;
            this.label4.Text = "Channel settings";
            this.label4.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Dock = System.Windows.Forms.DockStyle.Fill;
            this.label5.Font = new System.Drawing.Font("Arial", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.label5.ForeColor = System.Drawing.Color.White;
            this.label5.Location = new System.Drawing.Point(3, 80);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(109, 26);
            this.label5.TabIndex = 7;
            this.label5.Text = "Channel";
            this.label5.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Dock = System.Windows.Forms.DockStyle.Fill;
            this.label6.Font = new System.Drawing.Font("Arial", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.label6.ForeColor = System.Drawing.Color.White;
            this.label6.Location = new System.Drawing.Point(3, 106);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(109, 26);
            this.label6.TabIndex = 8;
            this.label6.Text = "Messages Period";
            this.label6.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // ChannelTextbox
            // 
            this.ChannelTextbox.Font = new System.Drawing.Font("Arial", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.ChannelTextbox.Location = new System.Drawing.Point(118, 83);
            this.ChannelTextbox.Name = "ChannelTextbox";
            this.ChannelTextbox.Size = new System.Drawing.Size(110, 20);
            this.ChannelTextbox.TabIndex = 9;
            // 
            // MessagedPeriodTextbox
            // 
            this.MessagedPeriodTextbox.Font = new System.Drawing.Font("Arial", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.MessagedPeriodTextbox.Location = new System.Drawing.Point(118, 109);
            this.MessagedPeriodTextbox.Name = "MessagedPeriodTextbox";
            this.MessagedPeriodTextbox.Size = new System.Drawing.Size(110, 20);
            this.MessagedPeriodTextbox.TabIndex = 10;
            this.MessagedPeriodTextbox.Text = "5000";
            // 
            // TickTimer
            // 
            this.TickTimer.Enabled = true;
            this.TickTimer.Interval = 20;
            this.TickTimer.Tick += new System.EventHandler(this.TickTimer_Tick);
            // 
            // TwitchTimer
            // 
            this.TwitchTimer.Interval = 5000;
            this.TwitchTimer.Tick += new System.EventHandler(this.TwitchTimer_Tick);
            // 
            // ImageSelectionButton
            // 
            this.tableLayoutPanel1.SetColumnSpan(this.ImageSelectionButton, 2);
            this.ImageSelectionButton.Dock = System.Windows.Forms.DockStyle.Fill;
            this.ImageSelectionButton.Location = new System.Drawing.Point(3, 165);
            this.ImageSelectionButton.Name = "ImageSelectionButton";
            this.ImageSelectionButton.Size = new System.Drawing.Size(225, 23);
            this.ImageSelectionButton.TabIndex = 11;
            this.ImageSelectionButton.Text = "Select Image";
            this.ImageSelectionButton.UseVisualStyleBackColor = true;
            this.ImageSelectionButton.Click += new System.EventHandler(this.ImageSelectionButton_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.Black;
            this.ClientSize = new System.Drawing.Size(970, 720);
            this.Controls.Add(this.MainContainer);
            this.DoubleBuffered = true;
            this.Name = "Form1";
            this.Text = "Form1";
            this.MainContainer.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.MainContainer)).EndInit();
            this.MainContainer.ResumeLayout(false);
            this.ControlSplitter.Panel1.ResumeLayout(false);
            this.ControlSplitter.Panel1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.ControlSplitter)).EndInit();
            this.ControlSplitter.ResumeLayout(false);
            this.tableLayoutPanel1.ResumeLayout(false);
            this.tableLayoutPanel1.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.SplitContainer MainContainer;
        private System.Windows.Forms.Timer TickTimer;
        private System.Windows.Forms.SplitContainer ControlSplitter;
        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel1;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox UsernameTextbox;
        private System.Windows.Forms.TextBox AccessTokenTextbox;
        private System.Windows.Forms.Button ConnectButton;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.TextBox ChannelTextbox;
        private System.Windows.Forms.TextBox MessagedPeriodTextbox;
        private System.Windows.Forms.Timer TwitchTimer;
        private System.Windows.Forms.Button ImageSelectionButton;
    }
}

