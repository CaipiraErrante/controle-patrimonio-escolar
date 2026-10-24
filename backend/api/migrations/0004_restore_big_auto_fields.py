from django.core.management.color import no_style
from django.db import migrations, models


def reset_inventory_sequences(apps, schema_editor):
    inventory_models = [
        apps.get_model('api', 'BensImateriais'),
        apps.get_model('api', 'BensImoveis'),
        apps.get_model('api', 'BensMoveis'),
        apps.get_model('api', 'BensSemoventes'),
    ]
    statements = schema_editor.connection.ops.sequence_reset_sql(
        no_style(), inventory_models
    )
    with schema_editor.connection.cursor() as cursor:
        for statement in statements:
            cursor.execute(statement)


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_rename_codigopatrimonio_bensimateriais_numeropatrimonio_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bensimateriais',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='bensimoveis',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='bensmoveis',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='benssemoventes',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.RunPython(
            reset_inventory_sequences,
            migrations.RunPython.noop,
        ),
    ]
